import api from './api';

export async function obtenerCategorias() {
  try {
    const { data } = await api.get('/categorias');
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
}