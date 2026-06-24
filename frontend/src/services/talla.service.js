import api from './api';

export async function obtenerTallas() {
  try {
    const { data } = await api.get('/tallas');
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener tallas:', error);
    return [];
  }
}