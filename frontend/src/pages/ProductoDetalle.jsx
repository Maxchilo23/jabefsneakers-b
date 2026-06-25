import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductoPorId } from '../services/producto.service';
import { formatearPrecio } from '../utils/formatearPrecio';
import useCarritoStore from '../store/carritoStore';
import Loader from '../components/ui/Loader';
import styles from './ProductoDetalle.module.css';

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
      setMensaje('Selecciona una talla');
      return;
    }
    agregarItem(producto, tallaSeleccionada || 'Única', cantidad);
    setMensaje('Producto agregado al carrito');
    setTimeout(() => setMensaje(''), 2000);
  }

  if (cargando) return <Loader texto="Cargando producto..." />;
  if (!producto) return <p className={styles.description}>Producto no encontrado.</p>;

  return (
    <div className={styles.page}>
      <button onClick={() => navigate(-1)} className={styles.back}>
        ← Volver
      </button>

      <div className={styles.grid}>
        <div className={styles.imageWrap}>
          <img
            src={producto.imagenPrincipal || 'https://via.placeholder.com/500'}
            alt={producto.nombre}
            className={styles.image}
          />
        </div>

        <div>
          <span className={styles.category}>{producto.categoria?.nombre}</span>
          <h1 className={styles.title}>{producto.nombre}</h1>
          <p className={styles.price}>{formatearPrecio(producto.precio)}</p>

          <hr className={styles.divider} />

          {producto.descripcion && (
            <p className={styles.description}>{producto.descripcion}</p>
          )}

          {producto.tallas?.length > 0 && (
            <>
              <span className={styles.label}>Talla</span>
              <div className={styles.tallas}>
                {producto.tallas.map((pt) => {
                  const sinStock = pt.stock <= 0;
                  const activa = tallaSeleccionada === pt.talla.valor;
                  return (
                    <button
                      key={pt.id}
                      disabled={sinStock}
                      onClick={() => setTallaSeleccionada(pt.talla.valor)}
                      className={`${styles.talla} ${activa ? styles.tallaActiva : ''} ${sinStock ? styles.tallaDisabled : ''}`}
                    >
                      {pt.talla.valor}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <span className={styles.label}>Cantidad</span>
          <div className={styles.cantidad}>
            <button onClick={() => setCantidad((c) => Math.max(1, c - 1))} className={styles.qtyBtn}>−</button>
            <span className={styles.qtyValue}>{cantidad}</span>
            <button onClick={() => setCantidad((c) => c + 1)} className={styles.qtyBtn}>+</button>
          </div>

          <button onClick={handleAgregarCarrito} className={styles.cta}>
            Agregar al carrito
          </button>

          {mensaje && <p className={styles.feedback}>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;