const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { subirImagen } = require('../controllers/upload.controller');
const verificarToken = require('../middlewares/auth.middleware');

router.post('/', verificarToken, upload.single('imagen'), subirImagen);

module.exports = router;