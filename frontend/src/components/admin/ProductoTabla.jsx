import { formatearPrecio } from '../../utils/formatearPrecio';

function ProductoTabla({ productos, onEditar, onEliminar }) {
  if (productos.length === 0) {
    return <p className="text-gray-400 text-center py-8">No hay productos creados.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-700">
            <th className="py-2 pr-4">Imagen</th>
            <th className="py-2 pr-4">Nombre</th>
            <th className="py-2 pr-4">Categoría</th>
            <th className="py-2 pr-4">Precio</th>
            <th className="py-2 pr-4">Stock total</th>
            <th className="py-2 pr-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const stockTotal = producto.tallas?.reduce((acc, t) => acc + t.stock, 0) || 0;
            return (
              <tr key={producto.id} className="border-b border-gray-800">
                <td className="py-3 pr-4">
                  <img
                    src={producto.imagenPrincipal || 'https://via.placeholder.com/50'}
                    alt={producto.nombre}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="py-3 pr-4 text-white text-sm">{producto.nombre}</td>
                <td className="py-3 pr-4 text-gray-300 text-sm">
                  {producto.categoria?.nombre}
                </td>
                <td className="py-3 pr-4 text-white text-sm">
                  {formatearPrecio(producto.precio)}
                </td>
                <td className="py-3 pr-4 text-gray-300 text-sm">{stockTotal}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditar(producto)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onEliminar(producto.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductoTabla;