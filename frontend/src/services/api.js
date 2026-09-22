import { getToken, clearAuth } from './auth';

const API_BASE = '/api';

function expulsarSesion() {
  clearAuth();
  window.dispatchEvent(new Event('auth-clear'));
}

function toQuery(params) {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!entries.length) return '';
  return `?${new URLSearchParams(entries).toString()}`;
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && token) expulsarSesion();
    throw new Error(data.error || data.errores?.join(', ') || 'Error del servidor');
  }

  return data;
}

export const api = {
  auth: {
    login: (datos) => request('/auth/login', { method: 'POST', body: JSON.stringify(datos) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me'),
    listarUsuarios: () => request('/auth/usuarios'),
    crearUsuario: (datos) => request('/auth/usuarios', { method: 'POST', body: JSON.stringify(datos) }),
    cambiarPassword: (datos) => request('/auth/cambiar-password', { method: 'POST', body: JSON.stringify(datos) })
  },
  categorias: {
    listar: () => request('/categorias'),
    obtener: (id) => request(`/categorias/${id}`),
    crear: (datos) => request('/categorias', { method: 'POST', body: JSON.stringify(datos) }),
    actualizar: (id, datos) => request(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
    eliminar: (id) => request(`/categorias/${id}`, { method: 'DELETE' })
  },
  productos: {
    listar: () => request('/productos'),
    obtener: (id) => request(`/productos/${id}`),
    crear: (datos) => request('/productos', { method: 'POST', body: JSON.stringify(datos) }),
    actualizar: (id, datos) => request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
    eliminar: (id) => request(`/productos/${id}`, { method: 'DELETE' })
  },
  movimientos: {
    listar: (params) => request(`/movimientos${toQuery(params)}`),
    obtener: (id) => request(`/movimientos/${id}`),
    crear: (datos) => request('/movimientos', { method: 'POST', body: JSON.stringify(datos) })
  }
};