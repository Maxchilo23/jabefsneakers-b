import { useState } from 'react';
import useCarritoStore from '../../store/carritoStore';
import { formatearPrecio } from '../../utils/formatearPrecio';
import { crearPedido } from '../../services/pedido.service';
import CarritoItem from './CarritoItem';
import styles from './CarritoDrawer.module.css';

function CarritoDrawer({ abierto, onCerrar }) {
  const items = useCarritoStore((state) => state.items);
  const obtenerTotal = useCarritoStore((state) => state.obtenerTotal());
  const vaciarCarrito = useCarritoStore((state) => state.vaciarCarrito);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  if (!abierto) return null;

  async function handleComprar() {
    setError('');
    if (!nombre.trim() || !telefono.trim()) {
      setError('Ingresa tu nombre y teléfono');
      return;
    }
    if (items.length === 0) {
      setError('Tu carrito está vacío');
      return;
    }

    setEnviando(true);
    try {
      const pedidoData = {
        clienteNombre: nombre,
        clienteTelefono: telefono,
        items: items.map((item) => ({
          productoId: item.productoId,
          tallaTexto: item.tallaTexto,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
      };
      const respuesta = await crearPedido(pedidoData);
      window.open(respuesta.linkWhatsapp, '_blank');
      vaciarCarrito();
      onCerrar();
    } catch (err) {
      console.error(err);
      setError('Hubo un error al procesar tu pedido');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onCerrar} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Carrito</h2>
          <button onClick={onCerrar} className={styles.close}>Cerrar</button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <p className={styles.empty}>Tu carrito está vacío</p>
          ) : (
            items.map((item, i) => (
              <CarritoItem key={`${item.productoId}-${item.tallaTexto}-${i}`} item={item} />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatearPrecio(obtenerTotal)}</span>
            </div>

            <input
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={styles.input}
            />
            <input
              type="tel"
              placeholder="Tu WhatsApp (ej: 51987654321)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={styles.input}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button onClick={handleComprar} disabled={enviando} className={styles.cta}>
              {enviando ? 'Procesando...' : 'Comprar por WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarritoDrawer;