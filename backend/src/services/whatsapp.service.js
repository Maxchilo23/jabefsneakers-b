function generarMensajeWhatsapp(pedido, detalles) {
  let mensaje = `🛒 *Nuevo Pedido - JabefSneakers*\n\n`;
  mensaje += `*Cliente:* ${pedido.clienteNombre}\n`;
  mensaje += `*Teléfono:* ${pedido.clienteTelefono}\n\n`;
  mensaje += `*Productos:*\n`;

  detalles.forEach((item) => {
    mensaje += `- ${item.producto.nombre} (Talla ${item.tallaTexto}) x${item.cantidad} - S/${(
      item.precioUnitario * item.cantidad
    ).toFixed(2)}\n`;
  });

  mensaje += `\n*Total: S/${Number(pedido.total).toFixed(2)}*\n\n`;
  mensaje += `Pedido #${pedido.id}`;

  return encodeURIComponent(mensaje);
}

function generarLinkWhatsapp(numeroDestino, mensaje) {
  return `https://wa.me/${numeroDestino}?text=${mensaje}`;
}

module.exports = { generarMensajeWhatsapp, generarLinkWhatsapp };