const crudModule = {
  async getTeamMembers() {
    try {
      const members = await supabaseClient.get('miembros_equipo', {
        select: '*'
      });
      return { success: true, data: members || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getTeamMemberTechnologies(memberId) {
    try {
      const techs = await supabaseClient.get('miembro_tecnologias', {
        filters: { miembro_id: memberId },
        order: 'categoria.asc,orden.asc'
      });
      return { success: true, data: techs || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getTeamMemberSocials(memberId) {
    try {
      const socials = await supabaseClient.get('miembro_redes', {
        filters: { miembro_id: memberId }
      });
      return { success: true, data: socials || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async createTeamMember(memberData) {
    if (!authModule.isRoot()) {
      return { success: false, error: 'No tienes permiso para crear miembros' };
    }

    try {
      const result = await supabaseClient.insert('miembros_equipo', {
        nombre: memberData.nombre,
        info: memberData.info,
        imagen_url: memberData.imagen_url,
        created_at: new Date().toISOString()
      });

      // Crear usuario automáticamente para el miembro
      if (result && result.length > 0 && memberData.nombre) {
        const userResult = await authModule.createAutoUser(memberData.nombre);
        // No fallar si el usuario ya existe, solo lo ignoramos
        if (!userResult.success && userResult.error === 'Usuario ya existe') {
          // Usuario ya existe, es ok
        } else if (!userResult.success) {
          // Log pero no fallar
          console.warn('⚠️ No se pudo crear usuario automático:', userResult.error);
        }
      }

      if (result && result.length > 0) {
        return { success: true, data: result[0] };
      }
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateTeamMember(memberId, memberData) {
    if (!authModule.isRoot()) {
      return { success: false, error: 'No tienes permiso para editar miembros' };
    }

    try {
      const result = await supabaseClient.update('miembros_equipo', memberId, {
        nombre: memberData.nombre,
        info: memberData.info,
        imagen_url: memberData.imagen_url,
        updated_at: new Date().toISOString()
      });

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteTeamMember(memberId) {
    if (!authModule.isRoot()) {
      return { success: false, error: 'No tienes permiso para eliminar miembros' };
    }

    try {
      await supabaseClient.delete('miembro_tecnologias', memberId);
      await supabaseClient.delete('miembro_redes', memberId);
      const result = await supabaseClient.delete('miembros_equipo', memberId);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async addTechnology(memberId, technologyData) {
    if (!authModule.isRoot()) {
      return { success: false, error: 'No tienes permiso para agregar tecnologías' };
    }

    try {
      const result = await supabaseClient.insert('miembro_tecnologias', {
        miembro_id: memberId,
        categoria: technologyData.categoria,
        nombre: technologyData.nombre,
        orden: technologyData.orden || 1,
        created_at: new Date().toISOString()
      });

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateTechnology(techId, technologyData) {
    if (!authModule.isRoot()) {
      return { success: false, error: 'No tienes permiso para editar tecnologías' };
    }

    try {
      const result = await supabaseClient.update('miembro_tecnologias', techId, {
        categoria: technologyData.categoria,
        nombre: technologyData.nombre,
        orden: technologyData.orden,
        updated_at: new Date().toISOString()
      });

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteTechnology(techId) {
    if (!authModule.isRoot()) {
      return { success: false, error: 'No tienes permiso para eliminar tecnologías' };
    }

    try {
      const result = await supabaseClient.delete('miembro_tecnologias', techId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async addSocial(memberId, socialData) {
    if (!authModule.isRoot()) {
      return { success: false, error: 'No tienes permiso para agregar redes' };
    }

    try {
      const result = await supabaseClient.insert('miembro_redes', {
        miembro_id: memberId,
        tipo: socialData.tipo,
        url: socialData.url,
        created_at: new Date().toISOString()
      });

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateSocial(socialId, socialData) {
    if (!authModule.isRoot()) {
      return { success: false, error: 'No tienes permiso para editar redes' };
    }

    try {
      const result = await supabaseClient.update('miembro_redes', socialId, {
        tipo: socialData.tipo,
        url: socialData.url,
        updated_at: new Date().toISOString()
      });

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteSocial(socialId) {
    if (!authModule.isRoot()) {
      return { success: false, error: 'No tienes permiso para eliminar redes' };
    }

    try {
      const result = await supabaseClient.delete('miembro_redes', socialId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

window.crudModule = crudModule;
