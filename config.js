const SUPABASE_URL = localStorage.getItem('supabase_url') || 
                     'https://nsgjjvjyiyiqecchvfmb.supabase.co';
const SUPABASE_ANON_KEY = localStorage.getItem('supabase_key') || 
                          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZ2pqdmp5aXlpcWVjY2h2Zm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTU4MTcsImV4cCI6MjA4NDU3MTgxN30.XMHHdqCXreBBhSoIuorKrhrgLD_-MzYRIh04l0jVDgs';


if (!SUPABASE_URL || SUPABASE_URL === 'null' || SUPABASE_URL === 'undefined') {
  console.error('SUPABASE_URL no configurada');
}
if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'null' || SUPABASE_ANON_KEY === 'undefined') {
  console.error('SUPABASE_ANON_KEY no configurada');
}

const supabaseClient = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,
  
  async request(endpoint, options = {}) {
    const url = `${this.url}/rest/v1${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': this.key,
      'Authorization': `Bearer ${localStorage.getItem('supabase_token') || this.key}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json().catch(() => null);
  },

  async get(table, query = {}) {
    let endpoint = `/${table}`;
    const params = new URLSearchParams();
    
    if (query.select) params.append('select', query.select);
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        if (typeof value === 'string' && value.includes('neq')) {
          params.append(key, value);
        } else {
          params.append(key, `eq.${value}`);
        }
      });
    }
    if (query.order) params.append('order', query.order);
    if (query.limit) params.append('limit', query.limit);
    
    if (params.toString()) endpoint += `?${params.toString()}`;
    return this.request(endpoint);
  },

  async insert(table, data) {
    return this.request(`/${table}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async update(table, id, data) {
    return this.request(`/${table}?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async delete(table, id) {
    return this.request(`/${table}?id=eq.${id}`, {
      method: 'DELETE'
    });
  },

  async auth(email, password) {
    const endpoint = '/auth/v1/token?grant_type=password';
    
    const response = await fetch(`${this.url}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.key
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      console.error('Auth error:', error);
      throw new Error(error.error_description || error.message || 'Authentication failed');
    }

    const data = await response.json();
    return data;
  }
};

window.supabaseClient = supabaseClient;
