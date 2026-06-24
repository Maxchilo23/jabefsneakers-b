import { useState, useEffect } from 'react';
import { obtenerCategorias } from '../../services/categoria.service';
import { obtenerTallas } from '../../services/talla.service';
import { crearProducto, actualizarProducto } from '../../services/admin.service';
import { subirImagen } from '../../services/upload.service';

function ProductoForm({ productoEditar, onGuardado, onCancelar }) {
  const [categorias, setCategorias] = useState([]);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState({});
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [previewImagen, setPreviewImagen] = useState('');

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

      const tallasMap = {};
      productoEditar.tallas?.forEach((pt) => {
        tallasMap[pt.tallaId] = pt.stock;
      });
      setTallasSeleccionadas(tallasMap);
    }
  }, [productoEditar]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleToggleTalla(tallaId) {
    setTallasSeleccionadas((prev) => {
      const copia = { ...prev };
      if (copia[tallaId] !== undefined) {
        delete copia[tallaId];
      } else {
        copia[tallaId] = 0;
      }
      return copia;
    });
  }

  function handleStockTalla(tallaId, stock) {
    setTallasSeleccionadas((prev) => ({
      ...prev,
      [tallaId]: Number(stock),
    }));
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
      setError('Error al subir la imagen');
    } finally {
      setSubiendoImagen(false);
    }
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
      };

      if (productoEditar) {
        await actualizarProducto(productoEditar.id, payload);
      } else {
        await crearProducto(payload);
      }

      onGuardado();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el producto');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-white">
        {productoEditar ? 'Editar producto' : 'Nuevo producto'}
      </h2>

      <div>
        <label className="text-gray-300 text-sm block mb-1">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="text-gray-300 text-sm block mb-1">Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows={3}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-300 text-sm block mb-1">Precio (S/)</label>
          <input
            type="number"
            step="0.01"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm block mb-1">Categoría</label>
          <select
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Selecciona...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-sm block mb-1">Imagen del producto</label>

        {previewImagen && (
          <img
            src={previewImagen}
            alt="preview"
            className="w-32 h-32 object-cover rounded-lg mb-2 border border-gray-600"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleSubirImagen}
          className="w-full bg-gray-700 text-gray-300 text-sm px-3 py-2 rounded-lg cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:cursor-pointer"
        />

        {subiendoImagen && (
          <p className="text-orange-400 text-sm mt-1">Subiendo imagen...</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="destacado"
          checked={form.destacado}
          onChange={handleChange}
          id="destacado"
        />
        <label htmlFor="destacado" className="text-gray-300 text-sm">
          Producto destacado
        </label>
      </div>

      <div>
        <label className="text-gray-300 text-sm block mb-2">Tallas y stock</label>
        <div className="grid grid-cols-3 gap-2">
          {tallasDisponibles.map((talla) => {
            const activa = tallasSeleccionadas[talla.id] !== undefined;
            return (
              <div
                key={talla.id}
                className={`border rounded-lg p-2 ${
                  activa ? 'border-orange-500 bg-gray-700' : 'border-gray-600'
                }`}
              >
                <label className="flex items-center gap-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    checked={activa}
                    onChange={() => handleToggleTalla(talla.id)}
                  />
                  {talla.valor}
                </label>
                {activa && (
                  <input
                    type="number"
                    placeholder="Stock"
                    value={tallasSeleccionadas[talla.id]}
                    onChange={(e) => handleStockTalla(talla.id, e.target.value)}
                    className="w-full mt-1 bg-gray-600 text-white px-2 py-1 rounded text-sm"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2 rounded-lg"
        >
          {guardando ? 'Guardando...' : 'Guardar producto'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ProductoForm;