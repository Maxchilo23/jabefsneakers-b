const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

async function login(req, res, next) {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ success: false, message: 'Usuario y contraseña son obligatorios' });
    }

    const admin = await prisma.admin.findUnique({ where: { usuario } });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, admin.password);

    if (!passwordValido) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, usuario: admin.usuario },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ success: true, token, usuario: admin.usuario });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };