import api from './api';

export async function obtenerProductos(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.categoriaId) params.append('categoriaId', filtros.categoriaId);
  if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
  if (filtros.talla) params.append('talla', filtros.talla);

  try {
    const { data } = await api.get(`/productos?${params.toString()}`);
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

export async function obtenerProductoPorId(id) {
  const { data } = await api.get(`/productos/${id}`);
  return data.data;
}