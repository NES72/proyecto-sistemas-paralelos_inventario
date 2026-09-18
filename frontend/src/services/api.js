const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.errores?.join(', ') || 'Error del servidor');
  }

  return data;
}

export const api = {
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
    listar: () => request('/movimientos'),
    obtener: (id) => request(`/movimientos/${id}`),
    crear: (datos) => request('/movimientos', { method: 'POST', body: JSON.stringify(datos) })
  }
};
