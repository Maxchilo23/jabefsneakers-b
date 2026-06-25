import { formatearPrecio } from '../../utils/formatearPrecio';
import styles from './ProductoCard.module.css';

function ProductoCard({ producto, onVerDetalle, index = 0 }) {
  return (
    <div className={styles.card} onClick={() => onVerDetalle(producto)}>
      <div className={styles.imageWrap}>
        <img
          src={producto.imagenPrincipal || 'https://via.placeholder.com/400'}
          alt={producto.nombre}
          className={styles.image}
        />
      </div>

      <div className={styles.meta}>
        <span className={styles.category}>{producto.categoria?.nombre}</span>
        <span className={styles.index}>Nº {String(index + 1).padStart(2, '0')}</span>
      </div>

      <h3 className={styles.name}>{producto.nombre}</h3>
      <p className={styles.price}>{formatearPrecio(producto.precio)}</p>
    </div>
  );
}

export default ProductoCard;