import { useState } from 'react';
import useCarritoStore from '../../store/carritoStore';
import { formatearPrecio } from '../../utils/formatearPrecio';
import { crearPedido } from '../../services/pedido.service';
import CarritoItem from './CarritoItem';

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
      setError('Por favor ingresa tu nombre y teléfono');
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

      // Redirigir a WhatsApp con el mensaje generado
      window.open(respuesta.linkWhatsapp, '_blank');

      // Limpiar carrito y cerrar
      vaciarCarrito();
      onCerrar();
    } catch (err) {
      console.error(err);
      setError('Hubo un error al procesar tu pedido. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/60" onClick={onCerrar} />

      <div className="relative w-full max-w-md bg-gray-950 h-full flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Tu carrito está vacío</p>
          ) : (
            items.map((item, i) => (
              <CarritoItem key={`${item.productoId}-${item.tallaTexto}-${i}`} item={item} />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-800 space-y-3">
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Total</span>
              <span>{formatearPrecio(obtenerTotal)}</span>
            </div>

            <input
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="tel"
              placeholder="Tu número de WhatsApp (ej: 51987654321)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleComprar}
              disabled={enviando}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {enviando ? 'Procesando...' : 'Comprar por WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarritoDrawer;