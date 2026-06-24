const prisma = require('../config/db');

// GET /api/productos  (con filtros opcionales: ?categoriaId=1&busqueda=nike)
async function listar(req, res, next) {
  try {
    const { categoriaId, busqueda, talla } = req.query;

    const where = { activo: true };

    if (categoriaId) {
      where.categoriaId = Number(categoriaId);
    }

    if (busqueda) {
      where.nombre = { contains: busqueda };
    }

    if (talla) {
      where.tallas = {
        some: { talla: { valor: talla }, stock: { gt: 0 } },
      };
    }

    const productos = await prisma.producto.findMany({
      where,
      include: {
        categoria: true,
        imagenes: true,
        tallas: { include: { talla: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: productos });
  } catch (error) {
    next(error);
  }
}

// GET /api/productos/:id
async function obtenerPorId(req, res, next) {
  try {
    const { id } = req.params;
    const producto = await prisma.producto.findUnique({
      where: { id: Number(id) },
      include: {
        categoria: true,
        imagenes: true,
        tallas: { include: { talla: true } },
      },
    });

    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, data: producto });
  } catch (error) {
    next(error);
  }
}

// POST /api/productos
async function crear(req, res, next) {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      categoriaId,
      imagenPrincipal,
      destacado,
      tallas, // [{ tallaId: 1, stock: 5 }, { tallaId: 2, stock: 3 }]
      imagenesAdicionales, // ["url1", "url2"]
    } = req.body;

    if (!nombre || !precio || !categoriaId) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, precio y categoría son obligatorios',
      });
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio,
        stock: stock || 0,
        categoriaId: Number(categoriaId),
        imagenPrincipal,
        destacado: destacado || false,
        tallas: tallas
          ? {
              create: tallas.map((t) => ({
                tallaId: t.tallaId,
                stock: t.stock,
              })),
            }
          : undefined,
        imagenes: imagenesAdicionales
          ? {
              create: imagenesAdicionales.map((url) => ({ url })),
            }
          : undefined,
      },
      include: {
        categoria: true,
        imagenes: true,
        tallas: { include: { talla: true } },
      },
    });

    res.status(201).json({ success: true, data: producto });
  } catch (error) {
    next(error);
  }
}

// PUT /api/productos/:id
async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      precio,
      stock,
      categoriaId,
      imagenPrincipal,
      destacado,
      activo,
    } = req.body;

    const producto = await prisma.producto.update({
      where: { id: Number(id) },
      data: {
        nombre,
        descripcion,
        precio,
        stock,
        categoriaId: categoriaId ? Number(categoriaId) : undefined,
        imagenPrincipal,
        destacado,
        activo,
      },
      include: {
        categoria: true,
        imagenes: true,
        tallas: { include: { talla: true } },
      },
    });

    res.json({ success: true, data: producto });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    next(error);
  }
}

// DELETE /api/productos/:id
async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.producto.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    next(error);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };