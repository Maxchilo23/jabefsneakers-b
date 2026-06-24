const express = require('express');
const cors = require('cors');

const categoriaRoutes = require('./routes/categoria.routes');
const productoRoutes = require('./routes/producto.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const authRoutes = require('./routes/auth.routes');
const tallaRoutes = require('./routes/talla.routes');
const uploadRoutes = require('./routes/upload.routes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Rutas principales
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tallas', tallaRoutes);
app.use('/api/upload', uploadRoutes);

// Middleware de errores (siempre al final)
app.use(errorHandler);

module.exports = app;