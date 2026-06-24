async function subirImagen(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });
    }

    res.json({
      success: true,
      url: req.file.path, // Cloudinary devuelve la URL pública en .path
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { subirImagen };