import api from './api';

// Productos
export async function crearProducto(producto) {
  const { data } = await api.post('/productos', producto);
  return data.data;
}

export async function actualizarProducto(id, producto) {
  const { data } = await api.put(`/productos/${id}`, producto);
  return data.data;
}

export async function eliminarProducto(id) {
  const { data } = await api.delete(`/productos/${id}`);
  return data;
}

// Categorías
export async function crearCategoria(categoria) {
  const { data } = await api.post('/categorias', categoria);
  return data.data;
}