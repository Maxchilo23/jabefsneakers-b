import ProductoCard from './ProductoCard';
import styles from './ProductoGrid.module.css';

function ProductoGrid({ productos, onVerDetalle }) {
  if (productos.length === 0) {
    return <p className={styles.empty}>No se encontraron productos.</p>;
  }

  return (
    <div className={styles.grid}>
      {productos.map((producto, i) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          index={i}
          onVerDetalle={onVerDetalle}
        />
      ))}
    </div>
  );
}

export default ProductoGrid;