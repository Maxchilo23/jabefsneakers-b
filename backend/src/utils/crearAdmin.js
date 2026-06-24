const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

async function crearAdmin() {
  const usuario = 'admin';
  const passwordPlano = 'admin123'; // CAMBIA esto después del primer login

  const existe = await prisma.admin.findUnique({ where: { usuario } });
  if (existe) {
    console.log('El admin ya existe');
    return;
  }

  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  await prisma.admin.create({
    data: { usuario, password: passwordHash },
  });

  console.log(`Admin creado -> usuario: ${usuario} / password: ${passwordPlano}`);
}

crearAdmin()
  .catch(console.error)
  .finally(() => process.exit());