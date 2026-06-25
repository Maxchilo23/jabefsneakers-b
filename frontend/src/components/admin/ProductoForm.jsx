import { useState, useEffect } from 'react';
import { obtenerCategorias } from '../../services/categoria.service';
import { obtenerTallas } from '../../services/talla.service';
import { crearProducto, actualizarProducto } from '../../services/admin.service';
import { subirImagen } from '../../services/upload.service';
import styles from './ProductoForm.module.css';

function ProductoForm({ productoEditar, onGuardado, onCancelar }) {
  const [categorias, setCategorias] = useState([]);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState({});
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [previewImagen, setPreviewImagen] = useState('');

  // Imágenes adicionales (galería)
  const [imagenesGaleria, setImagenesGaleria] = useState([]); // array de URLs
  const [subiendoGaleria, setSubiendoGaleria] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '',
    imagenPrincipal: '',
    destacado: false,
  });

  useEffect(() => {
    obtenerCategorias().then(setCategorias);
    obtenerTallas().then(setTallasDisponibles);
  }, []);

  useEffect(() => {
    if (productoEditar) {
      setForm({
        nombre: productoEditar.nombre || '',
        descripcion: productoEditar.descripcion || '',
        precio: productoEditar.precio || '',
        categoriaId: productoEditar.categoriaId || '',
        imagenPrincipal: productoEditar.imagenPrincipal || '',
        destacado: productoEditar.destacado || false,
      });
      setPreviewImagen(productoEditar.imagenPrincipal || '');
      setImagenesGaleria(productoEditar.imagenes?.map((img) => img.url) || []);

      const tallasMap = {};
      productoEditar.tallas?.forEach((pt) => {
        tallasMap[pt.tallaId] = pt.stock;
      });
      setTallasSeleccionadas(tallasMap);
    }
  }, [productoEditar]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleToggleTalla(tallaId) {
    setTallasSeleccionadas((prev) => {
      const copia = { ...prev };
      if (copia[tallaId] !== undefined) delete copia[tallaId];
      else copia[tallaId] = 0;
      return copia;
    });
  }

  function handleStockTalla(tallaId, stock) {
    setTallasSeleccionadas((prev) => ({ ...prev, [tallaId]: Number(stock) }));
  }

  async function handleSubirImagen(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setPreviewImagen(URL.createObjectURL(archivo));
    setSubiendoImagen(true);
    setError('');
    try {
      const url = await subirImagen(archivo);
      setForm((prev) => ({ ...prev, imagenPrincipal: url }));
    } catch (err) {
      console.error(err);
      setError('Error al subir la imagen principal');
    } finally {
      setSubiendoImagen(false);
    }
  }

  // Subir varias imágenes a la galería (acepta selección múltiple)
  async function handleSubirGaleria(e) {
    const archivos = Array.from(e.target.files);
    if (archivos.length === 0) return;

    setSubiendoGaleria(true);
    setError('');

    try {
      const urls = await Promise.all(archivos.map((archivo) => subirImagen(archivo)));
      setImagenesGaleria((prev) => [...prev, ...urls]);
    } catch (err) {
      console.error(err);
      setError('Error al subir alguna imagen de la galería');
    } finally {
      setSubiendoGaleria(false);
      e.target.value = ''; // permite volver a seleccionar los mismos archivos si hace falta
    }
  }

  function handleQuitarImagenGaleria(index) {
    setImagenesGaleria((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.precio || !form.categoriaId) {
      setError('Nombre, precio y categoría son obligatorios');
      return;
    }
    setGuardando(true);
    try {
      const tallasArray = Object.entries(tallasSeleccionadas).map(
        ([tallaId, stock]) => ({ tallaId: Number(tallaId), stock })
      );
      const payload = {
        ...form,
        precio: Number(form.precio),
        categoriaId: Number(form.categoriaId),
        tallas: tallasArray,
        imagenesAdicionales: imagenesGaleria,
      };
      if (productoEditar) await actualizarProducto(productoEditar.id, payload);
      else await crearProducto(payload);
      onGuardado();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el producto');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>{productoEditar ? 'Editar producto' : 'Nuevo producto'}</h2>

      <div className={styles.field}>
        <label className={styles.label}>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} className={styles.input} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} className={styles.textarea} />
      </div>

      <div className={`${styles.row2} ${styles.field}`}>
        <div>
          <label className={styles.label}>Precio (S/)</label>
          <input type="number" step="0.01" name="precio" value={form.precio} onChange={handleChange} className={styles.input} />
        </div>
        <div>
          <label className={styles.label}>Categoría</label>
          <select name="categoriaId" value={form.categoriaId} onChange={handleChange} className={styles.select}>
            <option value="">Selecciona...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Imagen principal</label>
        {previewImagen && <img src={previewImagen} alt="preview" className={styles.preview} />}
        <input type="file" accept="image/*" onChange={handleSubirImagen} className={styles.fileInput} />
        {subiendoImagen && <p className={styles.uploading}>Subiendo imagen...</p>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Galería (otros ángulos)</label>

        {imagenesGaleria.length > 0 && (
          <div className={styles.galeriaGrid}>
            {imagenesGaleria.map((url, i) => (
              <div key={i} className={styles.galeriaItem}>
                <img src={url} alt={`vista ${i + 1}`} className={styles.galeriaImg} />
                <button
                  type="button"
                  onClick={() => handleQuitarImagenGaleria(i)}
                  className={styles.galeriaRemove}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleSubirGaleria}
          className={styles.fileInput}
        />
        {subiendoGaleria && <p className={styles.uploading}>Subiendo imágenes...</p>}
      </div>

      <div className={`${styles.checkboxRow} ${styles.field}`}>
        <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} id="destacado" />
        <label htmlFor="destacado" className={styles.checkboxLabel}>Producto destacado</label>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Tallas y stock</label>
        <div className={styles.tallasGrid}>
          {tallasDisponibles.map((talla) => {
            const activa = tallasSeleccionadas[talla.id] !== undefined;
            return (
              <div key={talla.id} className={`${styles.tallaBox} ${activa ? styles.tallaBoxActive : ''}`}>
                <label className={styles.tallaCheckLabel}>
                  <input type="checkbox" checked={activa} onChange={() => handleToggleTalla(talla.id)} />
                  {talla.valor}
                </label>
                {activa && (
                  <input
                    type="number"
                    placeholder="Stock"
                    value={tallasSeleccionadas[talla.id]}
                    onChange={(e) => handleStockTalla(talla.id, e.target.value)}
                    className={styles.stockInput}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="submit" disabled={guardando} className={styles.submit}>
          {guardando ? 'Guardando...' : 'Guardar producto'}
        </button>
        <button type="button" onClick={onCancelar} className={styles.cancel}>Cancelar</button>
      </div>
    </form>
  );
}

export default ProductoForm;