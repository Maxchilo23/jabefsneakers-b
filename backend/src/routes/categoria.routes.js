const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const verificarToken = require('../middlewares/auth.middleware');

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.obtenerPorId);
router.post('/', verificarToken, categoriaController.crear);
router.put('/:id', verificarToken, categoriaController.actualizar);
router.delete('/:id', verificarToken, categoriaController.eliminar);

module.exports = router;