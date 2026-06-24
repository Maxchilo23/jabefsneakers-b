const prisma = require('../config/db');

// GET /api/categorias
async function listar(req, res, next) {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
    res.json({ success: true, data: categorias });
  } catch (error) {
    next(error);
  }
}

// GET /api/categorias/:id
async function obtenerPorId(req, res, next) {
  try {
    const { id } = req.params;
    const categoria = await prisma.categoria.findUnique({
      where: { id: Number(id) },
    });

    if (!categoria) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    res.json({ success: true, data: categoria });
  } catch (error) {
    next(error);
  }
}

// POST /api/categorias
async function crear(req, res, next) {
  try {
    const { nombre, slug } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({ success: false, message: 'Nombre y slug son obligatorios' });
    }

    const categoria = await prisma.categoria.create({
      data: { nombre, slug },
    });

    res.status(201).json({ success: true, data: categoria });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Esa categoría o slug ya existe' });
    }
    next(error);
  }
}

// PUT /api/categorias/:id
async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, slug } = req.body;

    const categoria = await prisma.categoria.update({
      where: { id: Number(id) },
      data: { nombre, slug },
    });

    res.json({ success: true, data: categoria });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }
    next(error);
  }
}

// DELETE /api/categorias/:id
async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.categoria.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Categoría eliminada' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }
    next(error);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };