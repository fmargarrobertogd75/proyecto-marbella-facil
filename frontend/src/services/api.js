import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('marbella_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('marbella_token');
      localStorage.removeItem('marbella_usuario');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const negociosApi = {
  getAll: (params) => api.get('/negocios', { params }),
  getOne: (id) => api.get(`/negocios/${id}`),
  create: (data) => api.post('/negocios', data),
  update: (id, d) => api.put(`/negocios/${id}`, d),
  delete: (id) => api.delete(`/negocios/${id}`),
};

export const categoriasApi = { getAll: () => api.get('/categorias') };
export const caracteristicasApi = { getAll: () => api.get('/caracteristicas') };
export const planesApi = { getAll: () => api.get('/planes') };

export const playasApi = {
  getAll: () => api.get('/playas'),
  getOne: (id) => api.get(`/playas/${id}`),
  update: (id, d) => api.put(`/playas/${id}`, d),
};

export const transporteApi = {
  getLineas: () => api.get('/transporte/lineas'),
  getParadas: (lineaId) => api.get(`/transporte/paradas/${lineaId}`),
};

export const reservasApi = {
  getAll: () => api.get('/reservas'),
  create: (data) => api.post('/reservas', data),
  cambiarEstado: (id, d) => api.put(`/reservas/${id}/estado`, d),
  cancelarPropia: (id, data) => api.put(`/reservas/${id}/cancelar`, data),
  modificarPropia: (id, data) => api.put(`/reservas/${id}/modificar`, data),
};

export const resenasApi = {
  getByNegocio: (negocioId) => api.get(`/resenas/${negocioId}`),
  create: (data) => api.post('/resenas', data),
};

export const favoritosApi = {
  getAll: () => api.get('/favoritos'),
  toggle: (negocioId) => api.post(`/favoritos/${negocioId}/toggle`),
};

export const eventosApi = { getAll: (params) => api.get('/eventos', { params }) };
export const noticiasApi = { getAll: () => api.get('/noticias') };

export const notificacionesApi = {
  getAll: () => api.get('/notificaciones'),
  marcarLeida: (id) => api.put(`/notificaciones/${id}/leer`),
  marcarTodas: () => api.post('/notificaciones/marcar-todas'),
};

export const mensajesApi = {
  send: (data) => api.post('/mensajes', data),
};

export const bannersApi = {
  getActivo: (slug) => api.get(`/banners/${slug}`),
  click: (id) => api.post(`/banners/${id}/click`),
};

export const chatApi = {
  send: (messages) => api.post('/chat', { messages }),
};

export const adminApi = {
  getUsuarios: (params) => api.get('/admin/usuarios', { params }),
  createUsuario: (data) => api.post('/admin/usuarios', data),
  updateUsuario: (id, d) => api.put(`/admin/usuarios/${id}`, d),
  changePassword: (id, d) => api.put(`/admin/usuarios/${id}/password`, d),
  deleteUsuario: (id) => api.delete(`/admin/usuarios/${id}`),
  getAuditoria: () => api.get('/admin/auditoria'),
  getReportes: () => api.get('/admin/reportes'),
  toggleNegocio: (id, d) => api.put(`/admin/negocios/${id}/estado`, d),
  otorgarPuntos: (data) => api.post('/admin/puntos/otorgar', data),
  entregarCanje: (id) => api.put(`/admin/canjes/${id}/entregar`),
};

// ── Sistema de Puntos ────────────────────────────────────────
export const puntosApi = {
  getMisPuntos: () => api.get('/puntos/mis-puntos'),
  getHistorial: (params) => api.get('/puntos/historial', { params }),
  getNiveles: () => api.get('/niveles'),
};

// ── Sistema de Recompensas ───────────────────────────────────
export const recompensasApi = {
  getAll: (params) => api.get('/recompensas', { params }),
  canjear: (id) => api.post(`/recompensas/${id}/canjear`),
  getMisCanjes: (params) => api.get('/recompensas/mis-canjes', { params }),
};

// ── Reservas Extendidas ──────────────────────────────────────
export const reservasExtApi = {
  getMiHistorial: (params) => api.get('/reservas/mi-historial', { params }),
  verificarDisponibilidad: (data) => api.post('/reservas/verificar-disponibilidad', data),
};

// ── Panel de Negocio ─────────────────────────────────────────
export const negocioApi = {
  getReservas: (params) => api.get('/negocio/reservas', { params }),
  confirmarReserva: (id) => api.put(`/negocio/reservas/${id}/confirmar`),
  rechazarReserva: (id, data) => api.put(`/negocio/reservas/${id}/rechazar`, data),
  getEstadisticas: () => api.get('/negocio/estadisticas'),
  getOcupacion: (params) => api.get('/negocio/ocupacion', { params }),

  // Tipos de reserva
  getTiposReserva: (negocioId) => api.get(`/negocios/${negocioId}/tipos-reserva`),
  createTipoReserva: (data) => api.post('/negocio/tipos-reserva', data),
  updateTipoReserva: (id, data) => api.put(`/negocio/tipos-reserva/${id}`, data),
  deleteTipoReserva: (id) => api.delete(`/negocio/tipos-reserva/${id}`),

  // Slots de disponibilidad
  getSlots: (negocioId) => api.get(`/negocios/${negocioId}/slots-disponibilidad`),
  createSlot: (data) => api.post('/negocio/slots-disponibilidad', data),
  updateSlot: (id, data) => api.put(`/negocio/slots-disponibilidad/${id}`, data),
  deleteSlot: (id) => api.delete(`/negocio/slots-disponibilidad/${id}`),
};

export default api;
