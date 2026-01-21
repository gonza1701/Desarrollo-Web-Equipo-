// Verificar autenticación inmediatamente
window.addEventListener('load', async () => {
  // Esperar a que authModule esté disponible
  let attempts = 0;
  while (typeof authModule === 'undefined' && attempts < 20) {
    await new Promise(r => setTimeout(r, 50));
    attempts++;
  }
  
  if (typeof authModule !== 'undefined') {
    const isAuth = await authModule.checkAuth();
    
    if (!isAuth) {
      window.location.href = 'index.html';
      return;
    }
  }
});

let teamMembers = [];
const links = [
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
  { name: 'MDN', url: 'https://mdn.org' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'CodePen', url: 'https://codepen.io' },
  { name: 'Dev.to', url: 'https://dev.to' },
  { name: 'Hashnode', url: 'https://hashnode.com' },
  { name: 'CSS-Tricks', url: 'https://css-tricks.com' },
  { name: 'Smashing Magazine', url: 'https://smashingmagazine.com' },
  { name: 'FreeCodeCamp', url: 'https://freecodecamp.org' },
  { name: 'Udemy', url: 'https://udemy.com' },
  { name: 'Coursera', url: 'https://coursera.org' },
  { name: 'Frontend Masters', url: 'https://frontendmasters.com' },
  { name: 'Secretaría Académica BUAP', url: 'https://secreacademica.cs.buap.mx/' },
  { name: 'WebDevWorld', url: 'https://webdevworld.org' }
];

const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeModal');
const chromaGridEl = document.getElementById('chromaGrid');
const carouselTrack = document.getElementById('carouselTrack');
const btnBienvenida = document.getElementById('btnBienvenida');
const toastContainer = document.getElementById('toastContainer');
const html = document.documentElement;

const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const crudPanel = document.getElementById('crudPanel');
const closeCrudBtn = document.getElementById('closeCrudBtn');

function initLiquidBackground() {
  const canvas = document.getElementById('floatingLinesCanvas');
  
  const checkLiquidBackground = setInterval(() => {
    if (typeof window.LiquidBackground !== 'undefined') {
      clearInterval(checkLiquidBackground);
      
      try {
        const app = window.LiquidBackground(canvas);
        window.liquidApp = app;
        
        if (app.liquidPlane && app.liquidPlane.material) {
          app.liquidPlane.material.metalness = 0.5;
          app.liquidPlane.material.roughness = 0.4;
        }
        
        if (app.liquidPlane && app.liquidPlane.uniforms && app.liquidPlane.uniforms.displacementScale) {
          app.liquidPlane.uniforms.displacementScale.value = 3;
        }
        
        if (app.setRain) {
          app.setRain(false);
        }

        if (app.renderer && app.renderer.setClearColor) {
          app.renderer.setClearColor(0xf8f9fc, 1);
        }
      } catch (error) {
        console.error('Error al inicializar LiquidBackground:', error);

        try {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.fillStyle = '#f8f9fc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        } catch (e) {
        }
      }
    }
  }, 100);
}

function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const carousel = document.querySelector('.infinite-carousel');
  
  const allLinks = [...links, ...links, ...links];
  
  track.innerHTML = allLinks.map(link => `
    <div class="carousel-item">
      <a href="${link.url}" target="_blank" rel="noopener noreferrer">
        ${link.name}
      </a>
    </div>
  `).join('');

  carousel.addEventListener('wheel', (e) => {
    e.preventDefault();
    carousel.scrollLeft += e.deltaY * 2;
  });
}

function groupTecnologiesByCategory(tecnologias) {
  const categories = [];
  let currentCategory = { name: '', items: [] };

  tecnologias.forEach((tech) => {
    if (tech.categoria && tech.nombre) {
      if (currentCategory.name !== tech.categoria) {
        if (currentCategory.items.length > 0) {
          categories.push(currentCategory);
        }
        currentCategory = { name: tech.categoria, items: [] };
      }
      currentCategory.items.push(tech.nombre);
    }
  });

  if (currentCategory.items.length > 0) {
    categories.push(currentCategory);
  }

  return categories;
}

function createSocialIcon(type) {
  const icons = {
    facebook: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h3v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h1z"></path></svg>`,
    instagram: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><circle cx="17.5" cy="6.5" r="1.5"></circle></svg>`,
    github: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    linkedin: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>`
  };
  return icons[type] || '';
}

async function loadTeamMembers() {
  try {
    const result = await crudModule.getTeamMembers();
    if (result.success) {
      teamMembers = result.data || [];
      
      for (let member of teamMembers) {
        const techResult = await crudModule.getTeamMemberTechnologies(member.id);
        const socialResult = await crudModule.getTeamMemberSocials(member.id);
        
        member.lenguajes = techResult.data || [];
        member.redes = socialResult.data || [];
      }
      
      renderChromaGrid();
    }
  } catch (error) {
    console.error('Error cargando miembros:', error);
    showToast('Error al cargar miembros del equipo');
  }
}

function renderChromaGrid() {
  chromaGridEl.innerHTML = teamMembers.map(member => `
    <div class="chroma-grid-item" data-member-id="${member.id}">
      <div class="chroma-card">
        <div class="card-image">
          ${member.imagen_url ? `<img src="${member.imagen_url}" alt="${member.nombre}" class="profile-image">` : `
            <svg class="default-profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          `}
        </div>
        <div class="card-content">
          <div>
            <h3>${member.nombre}</h3>
            <p class="subtitle">${member.info}</p>
          </div>
          ${member.redes && member.redes.length > 0 ? `
            <div class="social-links">
              ${member.redes.map(red => `
                <a href="${red.url}" target="_blank" rel="noopener noreferrer" class="social-btn" title="${red.tipo}">
                  ${createSocialIcon(red.tipo)}
                </a>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.chroma-grid-item').forEach(item => {
    item.addEventListener('click', () => {
      const memberId = parseInt(item.dataset.memberId);
      const member = teamMembers.find(m => m.id === memberId);
      if (member) showModal(member);
    });
  });
}

function showModal(member) {
  const categories = member.lenguajes && member.lenguajes.length > 0 
    ? groupTecnologiesByCategory(member.lenguajes) 
    : [];

  document.getElementById('modalTitulo').textContent = member.nombre;
  document.getElementById('modalTexto').textContent = member.info;

  const modalImage = document.getElementById('modalImage');
  const modalIcon = document.getElementById('modalDefaultIcon');
  if (member.imagen_url) {
    modalImage.src = member.imagen_url;
    modalImage.style.display = 'block';
    modalIcon.style.display = 'none';
  } else {
    modalImage.style.display = 'none';
    modalIcon.style.display = 'block';
  }

  const modalLenguajes = document.getElementById('modalLenguajes');
  if (categories.length > 0) {
    modalLenguajes.style.display = 'block';

    const techTabs = document.getElementById('techTabs');
    techTabs.innerHTML = categories.map((cat, idx) => `
      <div class="tech-category">
        <button class="tech-tab" data-cat-idx="${idx}">
          ${cat.name}
        </button>
        <div class="tech-items" data-cat-idx="${idx}" style="display: none;">
          ${cat.items.map(item => `<div class="tech-item">${item}</div>`).join('')}
        </div>
      </div>
    `).join('');

    techTabs.querySelectorAll('.tech-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const idx = tab.dataset.catIdx;
        const itemsContainer = techTabs.querySelector(`[data-cat-idx="${idx}"].tech-items`);

        techTabs.querySelectorAll('.tech-items').forEach(items => {
          if (items.dataset.catIdx !== idx) {
            items.style.display = 'none';
          }
        });
        
        if (itemsContainer.style.display === 'none') {
          itemsContainer.style.display = 'block';
          tab.classList.add('active');
        } else {
          itemsContainer.style.display = 'none';
          tab.classList.remove('active');
        }
      });
    });
  } else {
    modalLenguajes.style.display = 'none';
  }

  const modalRedes = document.getElementById('modalRedes');
  const socials = member.redes || [];

  modalRedes.innerHTML = socials.map(social => `
    <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${social.tipo}">
      ${createSocialIcon(social.tipo)}
    </a>
  `).join('');

  modal.classList.add('show');
}

function closeModal() {
  modal.classList.remove('show');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function setupAutoClicksForMobile() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    const canvas = document.getElementById('floatingLinesCanvas');
    
    setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      });
      
      canvas.dispatchEvent(clickEvent);
    }, 4000); 
  }
}

function renderHeaderActions() {
  const headerActions = document.getElementById('headerActions');
  
  if (authModule.isAuthenticated()) {
    headerActions.innerHTML = `
      <div class="header-user-info">
        <button id="adminPanelBtn" class="admin-btn" ${!authModule.isRoot() ? 'style="display:none;"' : ''}>Admin</button>
        <button id="logoutBtn" class="logout-btn">Salir</button>
      </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    const adminPanelBtn = document.getElementById('adminPanelBtn');

    logoutBtn.addEventListener('click', async () => {
      await authModule.logout();
      window.location.reload();
    });

    if (adminPanelBtn) {
      adminPanelBtn.addEventListener('click', () => {
        showCrudPanel();
      });
    }
  } else {
    headerActions.innerHTML = `
      <button id="loginBtn" class="login-btn">Ingresar</button>
    `;

    document.getElementById('loginBtn').addEventListener('click', () => {
      loginModal.style.display = 'flex';
    });
  }
}

function showCrudPanel() {
  crudPanel.style.display = 'flex';
  loadCrudData();
}

function hideCrudPanel() {
  crudPanel.style.display = 'none';
}

async function loadCrudData() {
  if (authModule.isRoot()) {
    loadMiembros();
    loadUsuarios();
  }
}

async function loadMiembros() {
  const result = await crudModule.getTeamMembers();
  const list = document.getElementById('miembrosList');
  
  if (result.success && result.data) {
    list.innerHTML = result.data.map(member => `
      <div class="crud-item">
        <div class="item-info">
          <strong>${member.nombre}</strong>
          <small>${member.info}</small>
        </div>
        <div class="item-actions">
          <button class="edit-btn" data-member-id="${member.id}" title="Editar miembro">✏️ Editar</button>
          <button class="delete-btn" data-member-id="${member.id}" title="Eliminar miembro">🗑️ Eliminar</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.memberId;
        showMiembroForm(id);
      });
    });

    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('¿Eliminar este miembro? Esta acción no se puede deshacer.')) {
          const result = await crudModule.deleteTeamMember(btn.dataset.memberId);
          if (result.success) {
            showToast('Miembro eliminado');
            loadMiembros();
            loadTeamMembers();
          } else {
            showToast('Error: ' + result.error);
          }
        }
      });
    });
  }
}

function showMiembroForm(memberId = null) {
  const formPanel = document.getElementById('formPanel');
  const formTitle = document.getElementById('formTitle');
  const crudForm = document.getElementById('crudForm');

  formTitle.textContent = memberId ? 'Editar Miembro' : 'Nuevo Miembro';

  if (memberId) {
    const member = teamMembers.find(m => m.id === parseInt(memberId));
    crudForm.innerHTML = `
      <div class="form-group">
        <label for="memberNombre">Nombre:</label>
        <input type="text" id="memberNombre" value="${member.nombre}" required>
      </div>
      <div class="form-group">
        <label for="memberInfo">Descripción:</label>
        <textarea id="memberInfo" required>${member.info}</textarea>
      </div>
      <div class="form-group">
        <label for="memberImagen">URL de Imagen:</label>
        <input type="url" id="memberImagen" value="${member.imagen_url || ''}">
      </div>
      <button type="submit" class="form-submit">Guardar</button>
    `;

    crudForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const result = await crudModule.updateTeamMember(memberId, {
        nombre: document.getElementById('memberNombre').value,
        info: document.getElementById('memberInfo').value,
        imagen_url: document.getElementById('memberImagen').value
      });

      if (result.success) {
        showToast('Miembro actualizado');
        formPanel.style.display = 'none';
        loadMiembros();
        loadTeamMembers();
      } else {
        showToast('Error: ' + result.error);
      }
    });
  } else {
    crudForm.innerHTML = `
      <div class="form-group">
        <label for="memberNombre">Nombre:</label>
        <input type="text" id="memberNombre" required>
      </div>
      <div class="form-group">
        <label for="memberInfo">Descripción:</label>
        <textarea id="memberInfo" required></textarea>
      </div>
      <div class="form-group">
        <label for="memberImagen">URL de Imagen:</label>
        <input type="url" id="memberImagen">
      </div>
      <button type="submit" class="form-submit">Crear</button>
    `;

    crudForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const result = await crudModule.createTeamMember({
        nombre: document.getElementById('memberNombre').value,
        info: document.getElementById('memberInfo').value,
        imagen_url: document.getElementById('memberImagen').value
      });

      if (result.success) {
        showToast('Miembro creado');
        formPanel.style.display = 'none';
        loadMiembros();
        loadTeamMembers();
      } else {
        showToast('Error: ' + result.error);
      }
    });
  }

  formPanel.style.display = 'flex';
}

async function loadUsuarios() {
  try {
    const usuarios = await supabaseClient.get('usuarios');
    const list = document.getElementById('usuariosList');
    
    if (usuarios) {
      list.innerHTML = usuarios.map(user => {
        const isCurrentUser = authModule.currentUser && authModule.currentUser.id === user.id;
        const canDelete = !isCurrentUser && authModule.isRoot();
        
        // Generar credenciales automáticas basadas en el nombre
        const autoEmail = authModule.generateEmail(user.nombre);
        const autoPassword = authModule.generatePassword(user.nombre);
        
        return `
          <div class="crud-item">
            <div class="item-info">
              <strong>${user.nombre}</strong>
              <small>${user.email}</small>
              <span class="role-badge">${user.rol}</span>
              ${user.rol === 'usuario' ? `
                <div style="margin-top: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px; font-size: 12px;">
                  <div><strong>Credenciales de acceso:</strong></div>
                  <div>📧 Email: <code>${autoEmail}</code></div>
                  <div>🔐 Contraseña: <code>${autoPassword}</code></div>
                </div>
              ` : ''}
            </div>
            <div class="item-actions">
              ${isCurrentUser ? '<span style="color: #999; font-size: 12px;">Actual</span>' : ''}
              <button class="delete-user-btn" data-user-id="${user.id}" ${!canDelete ? 'disabled' : ''} title="${isCurrentUser ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.delete-user-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
            const result = await supabaseClient.delete('usuarios', btn.dataset.userId);
            if (result.success || !result.error) {
              showToast('Usuario eliminado');
              loadUsuarios();
            } else {
              showToast('Error al eliminar usuario');
            }
          }
        });
      });
    }
  } catch (error) {
    console.error('Error cargando usuarios:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const isAuth = await authModule.checkAuth();
  
  if (!isAuth) {
    loginModal.style.display = 'flex';
  } else {
    loginModal.style.display = 'none';
    renderHeaderActions();
    loadTeamMembers();
    initCarousel();
    setupAutoClicksForMobile();
    initLiquidBackground();
    initLiteYouTube();
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const result = await authModule.login(email, password);
    
    if (result.success) {
      loginModal.style.display = 'none';
      renderHeaderActions();
      loadTeamMembers();
      initCarousel();
      setupAutoClicksForMobile();
      initLiquidBackground();
      initLiteYouTube();
      showToast('Bienvenido ' + result.user.nombre);
    } else {
      document.getElementById('loginError').textContent = result.error;
      document.getElementById('loginError').style.display = 'block';
    }
  });

  document.getElementById('btnCrearCuenta').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
      document.getElementById('loginError').textContent = 'Por favor completa email y contraseña';
      document.getElementById('loginError').style.display = 'block';
      return;
    }

    // Validar contraseña antes de enviar
    const passValidation = authModule.validatePassword(password);
    if (!passValidation.valid) {
      document.getElementById('loginError').textContent = passValidation.error;
      document.getElementById('loginError').style.display = 'block';
      return;
    }

    const result = await authModule.createUser(email, password);
    
    if (result.success) {
      document.getElementById('loginError').textContent = '';
      document.getElementById('loginError').style.display = 'none';
      if (result.isFirstUser) {
        showToast('¡Bienvenido! Eres el primer usuario - Administrador creado.');
      } else {
        showToast('Cuenta creada exitosamente. Por favor inicia sesión.');
      }
      document.getElementById('loginPassword').value = '';
    } else {
      document.getElementById('loginError').textContent = result.error || 'Error al crear la cuenta';
      document.getElementById('loginError').style.display = 'block';
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  closeCrudBtn.addEventListener('click', hideCrudPanel);

  document.getElementById('btnAddMiembro').addEventListener('click', () => {
    showMiembroForm();
  });

  document.getElementById('btnAddUser').addEventListener('click', () => {
    showUserForm();
  });

  document.getElementById('closeFormBtn').addEventListener('click', () => {
    document.getElementById('formPanel').style.display = 'none';
  });

  document.querySelectorAll('.crud-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.crud-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.crud-tab-content').forEach(t => t.classList.remove('active'));
      
      e.target.classList.add('active');
      const tabName = e.target.dataset.tab;
      document.getElementById(tabName + 'Tab').classList.add('active');
    });
  });

  let welcomeToastActive = false;
  btnBienvenida.addEventListener('click', () => {
    if (!welcomeToastActive) {
      welcomeToastActive = true;
      showToast('Bienvenido a la materia Desarrollo de aplicaciones Web');
      setTimeout(() => {
        welcomeToastActive = false;
      }, 4000);
    }
  });
});

function showUserForm() {
  const formPanel = document.getElementById('formPanel');
  const formTitle = document.getElementById('formTitle');
  const crudForm = document.getElementById('crudForm');

  formTitle.textContent = 'Nuevo Usuario';

  crudForm.innerHTML = `
    <div class="form-group">
      <label for="userName">Nombre:</label>
      <input type="text" id="userName" required>
    </div>
    <div class="form-group">
      <label for="userEmail">Correo:</label>
      <input type="email" id="userEmail" required>
    </div>
    <div class="form-group">
      <label for="userPassword">Contraseña:</label>
      <input type="password" id="userPassword" required>
    </div>
    <div class="form-group">
      <label for="userRole">Rol:</label>
      <select id="userRole" required>
        <option value="usuario">Usuario</option>
        <option value="root">Root</option>
      </select>
    </div>
    <button type="submit" class="form-submit">Crear Usuario</button>
  `;

  crudForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await authModule.createUser(
      document.getElementById('userEmail').value,
      document.getElementById('userPassword').value,
      document.getElementById('userName').value,
      document.getElementById('userRole').value
    );

    if (result.success) {
      showToast('Usuario creado exitosamente');
      formPanel.style.display = 'none';
      loadUsuarios();
    } else {
      showToast('Error: ' + result.error);
    }
  });

  formPanel.style.display = 'flex';
}

function initLiteYouTube() {
  const liteEls = document.querySelectorAll('.lite-yt');
  const videoOverlay = document.getElementById('videoModalOverlay');
  const videoContainer = document.getElementById('videoEmbedContainer');
  const closeBtn = document.getElementById('videoModalClose');

  // Cerrar modal con botón X
  closeBtn.addEventListener('click', () => {
    videoOverlay.classList.remove('active');
    videoContainer.innerHTML = '';
    document.body.style.overflow = '';
  });

  // Cerrar modal al hacer click en el fondo
  videoOverlay.addEventListener('click', (e) => {
    if (e.target === videoOverlay) {
      videoOverlay.classList.remove('active');
      videoContainer.innerHTML = '';
      document.body.style.overflow = '';
    }
  });

  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoOverlay.classList.contains('active')) {
      videoOverlay.classList.remove('active');
      videoContainer.innerHTML = '';
      document.body.style.overflow = '';
    }
  });

  liteEls.forEach((el) => {
    const id = el.getAttribute('data-ytid');
    const thumbUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    const thumb = document.createElement('div');
    thumb.className = 'yt-thumb';
    thumb.style.backgroundImage = `url(${thumbUrl})`;
    el.appendChild(thumb);

    const play = document.createElement('div');
    play.className = 'yt-play';
    el.appendChild(play);

    el.addEventListener('click', () => {
      // Crear iframe
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = 'YouTube video player';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      // Mostrar modal
      videoContainer.innerHTML = '';
      videoContainer.appendChild(iframe);
      videoOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}

function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const carousel = document.querySelector('.infinite-carousel');
  
  const allLinks = [...links, ...links, ...links];
  
  track.innerHTML = allLinks.map(link => `
    <div class="carousel-item">
      <a href="${link.url}" target="_blank" rel="noopener noreferrer">
        ${link.name}
      </a>
    </div>
  `).join('');

  carousel.addEventListener('wheel', (e) => {
    e.preventDefault();
    carousel.scrollLeft += e.deltaY * 2;
  });
}

function groupTecnologiesByCategory(lenguajes) {
  if (!lenguajes || !Array.isArray(lenguajes)) {
    return [];
  }

  // Group technologies by categoria
  const groupedByCategory = {};
  
  lenguajes.forEach((tech) => {
    if (tech.categoria && tech.nombre) {
      if (!groupedByCategory[tech.categoria]) {
        groupedByCategory[tech.categoria] = [];
      }
      groupedByCategory[tech.categoria].push(tech.nombre);
    }
  });

  // Convert to array format
  return Object.keys(groupedByCategory).map(category => ({
    name: category,
    items: groupedByCategory[category]
  }));
}

function createSocialIcon(type) {
  const icons = {
    facebook: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h3v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h1z"></path></svg>`,
    instagram: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><circle cx="17.5" cy="6.5" r="1.5"></circle></svg>`,
    github: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    linkedin: `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>`
  };
  return icons[type] || '';
}

function renderChromaGrid() {
  chromaGridEl.innerHTML = teamMembers.map(member => `
    <div class="chroma-grid-item" data-member-id="${member.id}">
      <div class="chroma-card">
        <div class="card-image">
          ${member.imagen ? `<img src="${member.imagen}" alt="${member.nombre}" class="profile-image">` : `
            <svg class="default-profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          `}
        </div>
        <div class="card-content">
          <div>
            <h3>${member.nombre}</h3>
            <p class="subtitle">${member.info}</p>
          </div>
          ${(member.facebook || member.instagram || member.github || member.linkedin) ? `
            <div class="social-links">
              ${member.facebook ? `<a href="${member.facebook}" target="_blank" rel="noopener noreferrer" class="social-btn" title="Facebook">${createSocialIcon('facebook')}</a>` : ''}
              ${member.instagram ? `<a href="${member.instagram}" target="_blank" rel="noopener noreferrer" class="social-btn" title="Instagram">${createSocialIcon('instagram')}</a>` : ''}
              ${member.github ? `<a href="${member.github}" target="_blank" rel="noopener noreferrer" class="social-btn" title="GitHub">${createSocialIcon('github')}</a>` : ''}
              ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn" title="LinkedIn">${createSocialIcon('linkedin')}</a>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.chroma-grid-item').forEach(item => {
    item.addEventListener('click', () => {
      const memberId = parseInt(item.dataset.memberId);
      const member = teamMembers.find(m => m.id === memberId);
      if (member) showModal(member);
    });
  });
}

let selectedCategoryIdx = null;

function showModal(member) {
  const categories = member.lenguajes.length > 0 ? groupTecnologiesByCategory(member.lenguajes) : [];
  selectedCategoryIdx = null;

  document.getElementById('modalTitulo').textContent = member.nombre;
  document.getElementById('modalTexto').textContent = member.info;

  const modalImage = document.getElementById('modalImage');
  const modalIcon = document.getElementById('modalDefaultIcon');
  if (member.imagen) {
    modalImage.src = member.imagen;
    modalImage.style.display = 'block';
    modalIcon.style.display = 'none';
  } else {
    modalImage.style.display = 'none';
    modalIcon.style.display = 'block';
  }

  const modalLenguajes = document.getElementById('modalLenguajes');
  if (categories.length > 0) {
    modalLenguajes.style.display = 'block';

    const techTabs = document.getElementById('techTabs');
    techTabs.innerHTML = categories.map((cat, idx) => `
      <div class="tech-category">
        <button class="tech-tab" data-cat-idx="${idx}">
          ${cat.name}
        </button>
        <div class="tech-items" data-cat-idx="${idx}" style="display: none;">
          ${cat.items.map(item => `<div class="tech-item">${item}</div>`).join('')}
        </div>
      </div>
    `).join('');

    techTabs.querySelectorAll('.tech-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const idx = tab.dataset.catIdx;
        const itemsContainer = techTabs.querySelector(`[data-cat-idx="${idx}"].tech-items`);

        techTabs.querySelectorAll('.tech-items').forEach(items => {
          if (items.dataset.catIdx !== idx) {
            items.style.display = 'none';
          }
        });
        
        if (itemsContainer.style.display === 'none') {
          itemsContainer.style.display = 'block';
          tab.classList.add('active');
        } else {
          itemsContainer.style.display = 'none';
          tab.classList.remove('active');
        }
      });
    });
  } else {
    modalLenguajes.style.display = 'none';
  }

  const modalRedes = document.getElementById('modalRedes');
  const socials = [];
  if (member.facebook) socials.push({ name: 'facebook', url: member.facebook });
  if (member.instagram) socials.push({ name: 'instagram', url: member.instagram });
  if (member.github) socials.push({ name: 'github', url: member.github });
  if (member.linkedin) socials.push({ name: 'linkedin', url: member.linkedin });

  modalRedes.innerHTML = socials.map(social => `
    <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${social.name}">
      ${createSocialIcon(social.name)}
    </a>
  `).join('');

  modal.classList.add('show');
}

function closeModal() {
  modal.classList.remove('show');
  selectedCategoryIdx = null;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function setupAutoClicksForMobile() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    const canvas = document.getElementById('floatingLinesCanvas');
    
    setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      });
      
      canvas.dispatchEvent(clickEvent);
    }, 4000); 
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  renderChromaGrid();
  setupAutoClicksForMobile();
  initLiquidBackground();
  initLiteYouTube();
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  let welcomeToastActive = false;
  btnBienvenida.addEventListener('click', () => {
    if (!welcomeToastActive) {
      welcomeToastActive = true;
      showToast('¡Bienvenido a la materia Desarrollo de aplicaciones Web');
      setTimeout(() => {
        welcomeToastActive = false;
      }, 4000);
    }
  });
});

function initLiteYouTube() {
  const liteEls = document.querySelectorAll('.lite-yt');
  const videoOverlay = document.getElementById('videoModalOverlay');
  const videoContainer = document.getElementById('videoEmbedContainer');
  const closeBtn = document.getElementById('videoModalClose');

  if (!videoOverlay || !videoContainer) {
    // Si no existen los elementos de modal, crear inline
    liteEls.forEach((el) => {
      const id = el.getAttribute('data-ytid');
      const thumbUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

      const thumb = document.createElement('div');
      thumb.className = 'yt-thumb';
      thumb.style.backgroundImage = `url(${thumbUrl})`;
      el.appendChild(thumb);

      const play = document.createElement('div');
      play.className = 'yt-play';
      el.appendChild(play);

      el.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.width = '560';
        iframe.height = '750';
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        iframe.title = 'YouTube video player';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;

        el.innerHTML = '';
        el.appendChild(iframe);
      }, { once: true });
    });
    return;
  }

  // Cerrar modal con el botón X
  closeBtn.addEventListener('click', () => {
    videoOverlay.classList.remove('active');
    videoContainer.innerHTML = '';
    document.body.style.overflow = '';
  });

  // Cerrar modal al hacer click en el fondo
  videoOverlay.addEventListener('click', (e) => {
    if (e.target === videoOverlay) {
      videoOverlay.classList.remove('active');
      videoContainer.innerHTML = '';
      document.body.style.overflow = '';
    }
  });

  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoOverlay.classList.contains('active')) {
      videoOverlay.classList.remove('active');
      videoContainer.innerHTML = '';
      document.body.style.overflow = '';
    }
  });

  liteEls.forEach((el) => {
    const id = el.getAttribute('data-ytid');
    const thumbUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    const thumb = document.createElement('div');
    thumb.className = 'yt-thumb';
    thumb.style.backgroundImage = `url(${thumbUrl})`;
    el.appendChild(thumb);

    const play = document.createElement('div');
    play.className = 'yt-play';
    el.appendChild(play);

    el.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = 'YouTube video player';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      videoContainer.innerHTML = '';
      videoContainer.appendChild(iframe);
      videoOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}
