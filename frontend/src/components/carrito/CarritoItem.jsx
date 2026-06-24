import { FiTrash2 } from 'react-icons/fi';
import { formatearPrecio } from '../../utils/formatearPrecio';
import useCarritoStore from '../../store/carritoStore';

function CarritoItem({ item }) {
  const cambiarCantidad = useCarritoStore((state) => state.cambiarCantidad);
  const quitarItem = useCarritoStore((state) => state.quitarItem);

  return (
    <div className="flex gap-3 py-4 border-b border-gray-800">
      <img
        src={item.imagen || 'https://via.placeholder.com/80'}
        alt={item.nombre}
        className="w-16 h-16 object-cover rounded-lg bg-gray-800"
      />

      <div className="flex-1">
        <p className="text-white text-sm font-medium line-clamp-1">{item.nombre}</p>
        <p className="text-gray-400 text-xs">Talla: {item.tallaTexto}</p>
        <p className="text-white font-semibold text-sm mt-1">
          {formatearPrecio(item.precioUnitario)}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() =>
              cambiarCantidad(item.productoId, item.tallaTexto, item.cantidad - 1)
            }
            className="w-6 h-6 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
          >
            -
          </button>
          <span className="text-white text-sm w-5 text-center">{item.cantidad}</span>
          <button
            onClick={() =>
              cambiarCantidad(item.productoId, item.tallaTexto, item.cantidad + 1)
            }
            className="w-6 h-6 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => quitarItem(item.productoId, item.tallaTexto)}
        className="text-gray-500 hover:text-red-500 self-start"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}

export default CarritoItem;