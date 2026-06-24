const prisma = require('../config/db');
const { generarMensajeWhatsapp, generarLinkWhatsapp } = require('../services/whatsapp.service');

// POST /api/pedidos
// Recibe el carrito desde el frontend y crea el pedido + genera el link de WhatsApp
async function crear(req, res, next) {
  try {
    const { clienteNombre, clienteTelefono, items } = req.body;
    // items = [{ productoId: 1, tallaTexto: "40", cantidad: 1, precioUnitario: 250.00 }]

    if (!clienteNombre || !clienteTelefono || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, teléfono y al menos un producto son obligatorios',
      });
    }

    // Calculamos el total en el backend (nunca confiar en el total del frontend)
    const total = items.reduce(
      (acc, item) => acc + Number(item.precioUnitario) * Number(item.cantidad),
      0
    );

    const pedido = await prisma.pedido.create({
      data: {
        clienteNombre,
        clienteTelefono,
        total,
        detalles: {
          create: items.map((item) => ({
            productoId: item.productoId,
            tallaTexto: item.tallaTexto,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          })),
        },
      },
      include: {
        detalles: {
          include: { producto: true },
        },
      },
    });

    const mensaje = generarMensajeWhatsapp(pedido, pedido.detalles);
    const numeroNegocio = process.env.WHATSAPP_NUMBER;
    const linkWhatsapp = generarLinkWhatsapp(numeroNegocio, mensaje);

    res.status(201).json({
      success: true,
      data: pedido,
      linkWhatsapp,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/pedidos (para el panel admin)
async function listar(req, res, next) {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: { detalles: { include: { producto: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: pedidos });
  } catch (error) {
    next(error);
  }
}

// PUT /api/pedidos/:id/estado
async function actualizarEstado(req, res, next) {
  try {
    const { id } = req.params;
    const { estado } = req.body; // PENDIENTE, CONTACTADO, COMPLETADO, CANCELADO

    const pedido = await prisma.pedido.update({
      where: { id: Number(id) },
      data: { estado },
    });

    res.json({ success: true, data: pedido });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
    next(error);
  }
}

module.exports = { crear, listar, actualizarEstado };