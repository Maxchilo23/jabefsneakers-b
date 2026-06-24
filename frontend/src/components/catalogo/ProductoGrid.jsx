import ProductoCard from './ProductoCard';

function ProductoGrid({ productos, onVerDetalle }) {
  if (productos.length === 0) {
    return (
      <p className="text-gray-400 text-center py-12">
        No se encontraron productos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {productos.map((producto) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          onVerDetalle={onVerDetalle}
        />
      ))}
    </div>
  );
}

export default ProductoGrid;