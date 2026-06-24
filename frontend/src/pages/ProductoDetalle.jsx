import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductoPorId } from '../services/producto.service';
import { formatearPrecio } from '../utils/formatearPrecio';
import SelectorTalla from '../components/catalogo/SelectorTalla';
import useCarritoStore from '../store/carritoStore';
import Loader from '../components/ui/Loader';

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');

  const agregarItem = useCarritoStore((state) => state.agregarItem);

  useEffect(() => {
    setCargando(true);
    obtenerProductoPorId(id)
      .then(setProducto)
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [id]);

  function handleAgregarCarrito() {
    if (producto.tallas?.length > 0 && !tallaSeleccionada) {
      setMensaje('Por favor selecciona una talla');
      return;
    }

    agregarItem(producto, tallaSeleccionada || 'Única', cantidad);
    setMensaje('¡Producto agregado al carrito!');
    setTimeout(() => setMensaje(''), 2000);
  }

  if (cargando) {
  return <Loader texto="Cargando producto..." />;
 }

  if (!producto) {
    return <p className="text-gray-400 text-center py-12">Producto no encontrado.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white mb-6 text-sm"
      >
        ← Volver
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden">
          <img
            src={producto.imagenPrincipal || 'https://via.placeholder.com/500'}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <p className="text-orange-500 uppercase text-sm font-semibold">
            {producto.categoria?.nombre}
          </p>
          <h1 className="text-3xl font-bold text-white mt-1">{producto.nombre}</h1>
          <p className="text-2xl text-white font-bold mt-4">
            {formatearPrecio(producto.precio)}
          </p>

          {producto.descripcion && (
            <p className="text-gray-400 mt-4 leading-relaxed">{producto.descripcion}</p>
          )}

          <div className="mt-6">
            <SelectorTalla
              tallas={producto.tallas}
              tallaSeleccionada={tallaSeleccionada}
              onSeleccionar={setTallaSeleccionada}
            />
          </div>

          {/* Cantidad */}
          <div className="mt-6">
            <p className="text-white font-semibold mb-2">Cantidad</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="w-9 h-9 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                -
              </button>
              <span className="text-white w-8 text-center">{cantidad}</span>
              <button
                onClick={() => setCantidad((c) => c + 1)}
                className="w-9 h-9 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Botón agregar */}
          <button
            onClick={handleAgregarCarrito}
            className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
          >
            Agregar al carrito
          </button>

          {mensaje && (
            <p className="text-center text-sm mt-3 text-green-400">{mensaje}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;