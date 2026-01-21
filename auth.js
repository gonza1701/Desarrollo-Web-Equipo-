const authModule = {
  currentUser: null,
  currentUserRole: null,

  // Generar correo automático: nombre@tempmail.com (sin espacios)
  generateEmail(nombre) {
    // Reemplazar espacios por puntos y convertir a minúsculas
    return `${nombre.toLowerCase().trim().replace(/\s+/g, '.')}@tempmail.com`;
  },

  // Generar contraseña: PrimerNombre2026. (solo primer nombre)
  generatePassword(nombre) {
    // Extraer solo el primer nombre (antes del primer espacio)
    const primerNombre = nombre.trim().split(' ')[0];
    const firstLetter = primerNombre.charAt(0).toUpperCase();
    const rest = primerNombre.slice(1).toLowerCase();
    return `${firstLetter}${rest}2026.`;
  },

  async login(email, password) {
    try {
      const data = await supabaseClient.auth(email, password);
      
      if (!data || !data.access_token) {
        throw new Error('No se recibió token de autenticación');
      }

      localStorage.setItem('supabase_token', data.access_token);
      localStorage.setItem('supabase_user_id', data.user.id);
      localStorage.setItem('supabase_user_email', data.user.email);

      const userData = await supabaseClient.get('usuarios', {
        filters: { email: data.user.email }
      });

      if (userData && userData.length > 0) {
        this.currentUser = userData[0];
        this.currentUserRole = userData[0].rol;
        localStorage.setItem('supabase_user_role', userData[0].rol);
      } else {
        console.warn('⚠️ Usuario NO encontrado en tabla usuarios (array vacío)');
        console.warn('El usuario se autenticó pero NO está en la tabla usuarios');
        // Usar fallback
        this.currentUser = { email: data.user.email, nombre: data.user.email.split('@')[0], id: data.user.id };
        this.currentUserRole = 'usuario';
        localStorage.setItem('supabase_user_role', 'usuario');
      }

      return { success: true, user: this.currentUser || { email: data.user.email, nombre: data.user.email.split('@')[0] } };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, error: error.message };
    }
  },

  async logout() {
    localStorage.removeItem('supabase_token');
    localStorage.removeItem('supabase_user_id');
    localStorage.removeItem('supabase_user_email');
    localStorage.removeItem('supabase_user_role');
    this.currentUser = null;
    this.currentUserRole = null;
  },

  async checkAuth() {
    const token = localStorage.getItem('supabase_token');
    const email = localStorage.getItem('supabase_user_email');
    const role = localStorage.getItem('supabase_user_role');

    if (token && email) {
      try {
        const userData = await supabaseClient.get('usuarios', {
          filters: { email }
        });

        if (userData && userData.length > 0) {
          this.currentUser = userData[0];
          this.currentUserRole = userData[0].rol;
          localStorage.setItem('supabase_user_role', userData[0].rol);
          return true;
        } else {
          console.warn('⚠️ Tabla usuarios vacía o sin coincidencias. Token existe pero usuario no en BD.');
          console.warn('Token:', token?.substring(0, 20) + '...');
          
          // Fallback: si tenemos token y email, considerarlo autenticado
          this.currentUser = { email, nombre: email.split('@')[0] };
          this.currentUserRole = role || 'usuario';
          return true;
        }
      } catch (error) {
        console.error('❌ Error en checkAuth:', error.message);
        // Si falla la conexión pero tenemos token, permitir acceso
        if (token && email && role) {
          this.currentUser = { email, nombre: email.split('@')[0] };
          this.currentUserRole = role;
          return true;
        }
      }
    }

    return false;
  },

  isAuthenticated() {
    return !!localStorage.getItem('supabase_token');
  },

  isRoot() {
    return this.currentUserRole === 'root';
  },

  canEdit() {
    return this.isRoot();
  },

  validatePassword(password) {
    // Validar longitud mínima
    if (password.length < 8) {
      return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
    }
    // Validar mayúscula
    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: 'La contraseña debe contener al menos una mayúscula' };
    }
    // Validar minúscula
    if (!/[a-z]/.test(password)) {
      return { valid: false, error: 'La contraseña debe contener al menos una minúscula' };
    }
    // Validar número
    if (!/[0-9]/.test(password)) {
      return { valid: false, error: 'La contraseña debe contener al menos un número' };
    }
    // Validar carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':",./<>?]/.test(password)) {
      return { valid: false, error: 'La contraseña debe contener al menos un carácter especial (!@#$%^&* etc)' };
    }
    return { valid: true };
  },

  async createUser(email, password, nombre, rol = 'usuario') {
    // Validar contraseña primero
    const passValidation = this.validatePassword(password);
    if (!passValidation.valid) {
      return { success: false, error: passValidation.error };
    }

    // Permitir crear usuarios si es root O si no hay usuarios registrados (primera cuenta)
    if (!this.isRoot()) {
      try {
        const existingUsers = await supabaseClient.get('usuarios');
        if (existingUsers && existingUsers.length > 0) {
          return { success: false, error: 'No tienes permiso para crear usuarios. Solo administradores pueden crear cuentas.' };
        }
      } catch (e) {
        // Si hay error al verificar usuarios, permitir (tabla vacía)
      }
    }

    try {
      const signupResponse = await fetch(`${supabaseClient.url}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseClient.key
        },
        body: JSON.stringify({ email, password })
      });

      if (!signupResponse.ok) {
        const error = await signupResponse.json();
        throw new Error(error.message || 'Error al crear usuario');
      }

      const userData = await signupResponse.json();

      if (!userData || !userData.user) {
        throw new Error('No se recibió información del usuario creado');
      }

      // Si es la primera cuenta, hacerla root
      let existingUsers = [];
      try {
        existingUsers = await supabaseClient.get('usuarios');
      } catch (e) {
        // Tabla usuarios vacía o no accesible
      }
      
      const newUserRole = (!existingUsers || existingUsers.length === 0) ? 'root' : rol;

      const usuarioData = {
        id: userData.user.id,
        email,
        nombre: nombre || email.split('@')[0],
        rol: newUserRole,
        created_at: new Date().toISOString()
      };

      await supabaseClient.insert('usuarios', usuarioData);

      return { success: true, user: userData.user, isFirstUser: newUserRole === 'root' };
    } catch (error) {
      console.error(' Error en createUser:', error);
      return { success: false, error: error.message };
    }  },

  async createAutoUser(nombre) {
    // Generar credenciales automáticas
    const email = this.generateEmail(nombre);
    const password = this.generatePassword(nombre);
    
    try {
      // Verificar si el usuario ya existe
      const existingUser = await supabaseClient.get('usuarios', {
        filters: { email }
      });
      
      if (existingUser && existingUser.length > 0) {
        return { success: false, error: 'Usuario ya existe', email, password };
      }

      // Crear usuario en auth
      const signupResponse = await fetch(`${supabaseClient.url}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseClient.key
        },
        body: JSON.stringify({ email, password })
      });

      if (!signupResponse.ok) {
        const error = await signupResponse.json();
        return { success: false, error: error.message || 'Error al crear usuario', email, password };
      }

      const userData = await signupResponse.json();

      if (!userData || !userData.user) {
        throw new Error('No se recibió información del usuario creado');
      }

      // Insertar en tabla usuarios con rol "usuario" (solo lectura)
      const usuarioData = {
        id: userData.user.id,
        email,
        nombre: nombre,
        rol: 'usuario', // Solo lectura
        created_at: new Date().toISOString()
      };

      await supabaseClient.insert('usuarios', usuarioData);

      return { 
        success: true, 
        user: userData.user, 
        email, 
        password,
        rol: 'usuario'
      };
    } catch (error) {
      console.error('❌ Error en createAutoUser:', error);
      return { success: false, error: error.message, email: this.generateEmail(nombre), password: this.generatePassword(nombre) };
    }  }
};

window.authModule = authModule;
