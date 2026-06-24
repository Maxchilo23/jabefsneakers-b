import api from './api';

export async function crearPedido(pedido) {
  const { data } = await api.post('/pedidos', pedido);
  return data; // incluye { success, data: pedido, linkWhatsapp }
}