import { formatearPrecio } from '../../utils/formatearPrecio';
import styles from './ProductoTabla.module.css';

function ProductoTabla({ productos, onEditar, onEliminar }) {
  if (productos.length === 0) {
    return <p className={styles.empty}>No hay productos creados.</p>;
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th className={styles.headCell}>Imagen</th>
            <th className={styles.headCell}>Nombre</th>
            <th className={styles.headCell}>Categoría</th>
            <th className={styles.headCell}>Precio</th>
            <th className={styles.headCell}>Stock</th>
            <th className={styles.headCell}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const stockTotal = producto.tallas?.reduce((acc, t) => acc + t.stock, 0) || 0;
            return (
              <tr key={producto.id} className={styles.row}>
                <td className={styles.cell}>
                  <img
                    src={producto.imagenPrincipal || 'https://via.placeholder.com/50'}
                    alt={producto.nombre}
                    className={styles.thumb}
                  />
                </td>
                <td className={styles.cell}>{producto.nombre}</td>
                <td className={styles.cell}>{producto.categoria?.nombre}</td>
                <td className={styles.cell}>{formatearPrecio(producto.precio)}</td>
                <td className={styles.cell}>{stockTotal}</td>
                <td className={styles.cell}>
                  <div className={styles.actions}>
                    <button onClick={() => onEditar(producto)} className={styles.action}>Editar</button>
                    <button onClick={() => onEliminar(producto.id)} className={`${styles.action} ${styles.actionDanger}`}>Eliminar</button>
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