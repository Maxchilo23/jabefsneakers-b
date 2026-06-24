const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Tallas de ropa y calzado
  const todasLasTallas = ['S', 'M', 'L', 'XL', 'XXL', '37', '38', '39', '40', '41', '42', '43', '44'];

  for (const valor of todasLasTallas) {
    const existe = await prisma.talla.findFirst({ where: { valor } });
    if (!existe) {
      await prisma.talla.create({ data: { valor } });
    }
  }
  console.log('Tallas creadas correctamente');

  // Categorías base
  const categorias = [
    { nombre: 'Zapatillas', slug: 'zapatillas' },
    { nombre: 'Ropa', slug: 'ropa' },
    { nombre: 'Pantalones', slug: 'pantalones' },
    { nombre: 'Casacas', slug: 'casacas' },
    { nombre: 'Busos', slug: 'busos' },
    { nombre: 'Conjuntos', slug: 'conjuntos' },
  ];

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Categorías creadas correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });