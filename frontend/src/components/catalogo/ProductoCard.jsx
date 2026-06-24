import { formatearPrecio } from '../../utils/formatearPrecio';

function ProductoCard({ producto, onVerDetalle }) {
  return (
    <div
      onClick={() => onVerDetalle(producto)}
      className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
    >
      <div className="aspect-square bg-gray-700 overflow-hidden">
        <img
          src={producto.imagenPrincipal || 'https://via.placeholder.com/400'}
          alt={producto.nombre}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-orange-500 uppercase font-semibold">
          {producto.categoria?.nombre}
        </p>
        <h3 className="text-white font-semibold mt-1 line-clamp-2">{producto.nombre}</h3>
        <p className="text-gray-300 mt-2 font-bold">{formatearPrecio(producto.precio)}</p>
      </div>
    </div>
  );
}

export default ProductoCard;