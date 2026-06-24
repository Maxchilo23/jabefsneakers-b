const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const verificarToken = require('../middlewares/auth.middleware');

router.get('/', productoController.listar);
router.get('/:id', productoController.obtenerPorId);
router.post('/', verificarToken, productoController.crear);
router.put('/:id', verificarToken, productoController.actualizar);
router.delete('/:id', verificarToken, productoController.eliminar);

module.exports = router;