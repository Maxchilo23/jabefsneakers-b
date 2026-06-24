const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

router.post('/', pedidoController.crear);
router.get('/', pedidoController.listar);
router.put('/:id/estado', pedidoController.actualizarEstado);

module.exports = router;