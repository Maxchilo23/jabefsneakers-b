const prisma = require('../config/db');

async function listar(req, res, next) {
  try {
    const tallas = await prisma.talla.findMany({ orderBy: { id: 'asc' } });
    res.json({ success: true, data: tallas });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar };