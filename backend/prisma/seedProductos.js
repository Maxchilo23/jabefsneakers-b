const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Obtenemos las categorías y tallas ya existentes (creadas en el seed.js anterior)
  const categorias = await prisma.categoria.findMany();
  const tallas = await prisma.talla.findMany();

  function getCategoriaId(slug) {
    return categorias.find((c) => c.slug === slug)?.id;
  }

  function getTallaId(valor) {
    return tallas.find((t) => t.valor === valor)?.id;
  }

  const productosEjemplo = [
    {
      nombre: 'Air Runner Classic',
      descripcion: 'Zapatilla urbana de perfil bajo, malla transpirable y suela de goma antideslizante. Ideal para uso diario.',
      precio: 289.9,
      categoriaSlug: 'zapatillas',
      imagenPrincipal: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      imagenesAdicionales: [
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
        'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800',
      ],
      tallasValores: ['39', '40', '41', '42'],
      destacado: true,
    },
    {
      nombre: 'Street Trainer Negro',
      descripcion: 'Diseño minimalista en negro total, entresuela amortiguada y agarre reforzado en punta y talón.',
      precio: 319.9,
      categoriaSlug: 'zapatillas',
      imagenPrincipal: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      imagenesAdicionales: [
        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
      ],
      tallasValores: ['38', '39', '40', '41', '43'],
      destacado: true,
    },
    {
      nombre: 'Hoodie Oversize Gris',
      descripcion: 'Buso de algodón premium, corte oversize, bolsillo canguro y capucha forrada.',
      precio: 149.9,
      categoriaSlug: 'busos',
      imagenPrincipal: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      imagenesAdicionales: [
        'https://images.unsplash.com/photo-1542406775-9b7c93a0cb1f?w=800',
      ],
      tallasValores: ['S', 'M', 'L', 'XL'],
      destacado: false,
    },
    {
      nombre: 'Casaca Bomber Negra',
      descripcion: 'Casaca estilo bomber con forro acolchado, puños elásticos y cierre frontal metálico.',
      precio: 219.9,
      categoriaSlug: 'casacas',
      imagenPrincipal: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      imagenesAdicionales: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      ],
      tallasValores: ['M', 'L', 'XL'],
      destacado: true,
    },
    {
      nombre: 'Jogger Cargo Beige',
      descripcion: 'Pantalón jogger con bolsillos laterales tipo cargo, puño ajustable y tela resistente.',
      precio: 129.9,
      categoriaSlug: 'pantalones',
      imagenPrincipal: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
      imagenesAdicionales: [],
      tallasValores: ['S', 'M', 'L', 'XL'],
      destacado: false,
    },
    {
      nombre: 'Polo Oversize Blanco',
      descripcion: 'Polo de algodón pesado, corte oversize y costuras reforzadas. Básico esencial de closet urbano.',
      precio: 79.9,
      categoriaSlug: 'ropa',
      imagenPrincipal: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      imagenesAdicionales: [],
      tallasValores: ['S', 'M', 'L'],
      destacado: false,
    },
    {
      nombre: 'Conjunto Deportivo Negro',
      descripcion: 'Set de buso + jogger en tela suave con acabado mate. Incluye ambas prendas a juego.',
      precio: 249.9,
      categoriaSlug: 'conjuntos',
      imagenPrincipal: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
      imagenesAdicionales: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
      ],
      tallasValores: ['M', 'L', 'XL'],
      destacado: true,
    },
    {
      nombre: 'High Top Blanca',
      descripcion: 'Zapatilla bota alta de cuero sintético, ideal para looks urbanos con pantalón ajustado.',
      precio: 299.9,
      categoriaSlug: 'zapatillas',
      imagenPrincipal: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
      imagenesAdicionales: [
        'https://images.unsplash.com/photo-1597248881519-db089d3744a5?w=800',
      ],
      tallasValores: ['37', '38', '39', '40'],
      destacado: false,
    },
  ];

  for (const p of productosEjemplo) {
    const categoriaId = getCategoriaId(p.categoriaSlug);

    if (!categoriaId) {
      console.log(`⚠️ Categoría "${p.categoriaSlug}" no encontrada, saltando "${p.nombre}"`);
      continue;
    }

    const tallasData = p.tallasValores
      .map((valor) => {
        const tallaId = getTallaId(valor);
        if (!tallaId) return null;
        return { tallaId, stock: Math.floor(Math.random() * 8) + 2 }; // stock random entre 2 y 9
      })
      .filter(Boolean);

    const existente = await prisma.producto.findFirst({ where: { nombre: p.nombre } });
    if (existente) {
      console.log(`↩️  "${p.nombre}" ya existe, saltando`);
      continue;
    }

    await prisma.producto.create({
      data: {
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        stock: tallasData.reduce((acc, t) => acc + t.stock, 0),
        categoriaId,
        imagenPrincipal: p.imagenPrincipal,
        destacado: p.destacado,
        tallas: { create: tallasData },
        imagenes: { create: p.imagenesAdicionales.map((url) => ({ url })) },
      },
    });

    console.log(`✅ Producto creado: ${p.nombre}`);
  }

  console.log('🎉 Productos de ejemplo cargados correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });