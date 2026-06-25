import { formatearPrecio } from '../../utils/formatearPrecio';
import useCarritoStore from '../../store/carritoStore';
import styles from './CarritoItem.module.css';

function CarritoItem({ item }) {
  const cambiarCantidad = useCarritoStore((state) => state.cambiarCantidad);
  const quitarItem = useCarritoStore((state) => state.quitarItem);

  return (
    <div className={styles.item}>
      <img
        src={item.imagen || 'https://via.placeholder.com/80'}
        alt={item.nombre}
        className={styles.image}
      />

      <div className={styles.info}>
        <p className={styles.name}>{item.nombre}</p>
        <p className={styles.talla}>Talla: {item.tallaTexto}</p>
        <p className={styles.price}>{formatearPrecio(item.precioUnitario)}</p>

        <div className={styles.qtyRow}>
          <button onClick={() => cambiarCantidad(item.productoId, item.tallaTexto, item.cantidad - 1)} className={styles.qtyBtn}>−</button>
          <span className={styles.qtyValue}>{item.cantidad}</span>
          <button onClick={() => cambiarCantidad(item.productoId, item.tallaTexto, item.cantidad + 1)} className={styles.qtyBtn}>+</button>
        </div>
      </div>

      <button onClick={() => quitarItem(item.productoId, item.tallaTexto)} className={styles.remove}>
        Quitar
      </button>
    </div>
  );
}

export default CarritoItem;