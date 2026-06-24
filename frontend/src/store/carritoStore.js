import { create } from 'zustand';

const useCarritoStore = create((set, get) => ({
  items: [],

  // Agregar producto al carrito (si ya existe con la misma talla, suma cantidad)
  agregarItem: (producto, talla, cantidad = 1) => {
    const items = get().items;
    const existente = items.find(
      (item) => item.productoId === producto.id && item.tallaTexto === talla
    );

    if (existente) {
      set({
        items: items.map((item) =>
          item.productoId === producto.id && item.tallaTexto === talla
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        ),
      });
    } else {
      set({
        items: [
          ...items,
          {
            productoId: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagenPrincipal,
            precioUnitario: Number(producto.precio),
            tallaTexto: talla,
            cantidad,
          },
        ],
      });
    }
  },

  // Quitar un item completo del carrito
  quitarItem: (productoId, tallaTexto) => {
    set({
      items: get().items.filter(
        (item) => !(item.productoId === productoId && item.tallaTexto === tallaTexto)
      ),
    });
  },

  // Cambiar cantidad de un item
  cambiarCantidad: (productoId, tallaTexto, cantidad) => {
    if (cantidad < 1) return;
    set({
      items: get().items.map((item) =>
        item.productoId === productoId && item.tallaTexto === tallaTexto
          ? { ...item, cantidad }
          : item
      ),
    });
  },

  // Vaciar carrito (después de confirmar pedido)
  vaciarCarrito: () => set({ items: [] }),

  // Total del carrito
  obtenerTotal: () => {
    return get().items.reduce(
      (acc, item) => acc + item.precioUnitario * item.cantidad,
      0
    );
  },

  // Cantidad total de productos (para el ícono del carrito)
  obtenerCantidadTotal: () => {
    return get().items.reduce((acc, item) => acc + item.cantidad, 0);
  },
}));

export default useCarritoStore;