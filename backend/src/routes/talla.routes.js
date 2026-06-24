const express = require('express');
const router = express.Router();
const tallaController = require('../controllers/talla.controller');

router.get('/', tallaController.listar);

module.exports = router;