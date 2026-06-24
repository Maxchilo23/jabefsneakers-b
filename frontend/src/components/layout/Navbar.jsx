import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import useCarritoStore from '../../store/carritoStore';

function Navbar({ onAbrirCarrito }) {
  const cantidadTotal = useCarritoStore((state) => state.obtenerCantidadTotal());
  const [menuAbierto, setMenuAbierto] = useState(false);

  const links = [
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/catalogo?categoria=zapatillas', label: 'Zapatillas' },
    { to: '/catalogo?categoria=ropa', label: 'Ropa' },
    { to: '/catalogo?categoria=pantalones', label: 'Pantalones' },
    { to: '/catalogo?categoria=casacas', label: 'Casacas' },
  ];

  return (
    <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          Jabef<span className="text-orange-500">Sneakers</span>
        </Link>

        <div className="hidden md:flex gap-6 text-gray-300">
          {links.map((link) => (
            <Link key={link.label} to={link.to} className="hover:text-white transition">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAbrirCarrito}
            className="relative p-2 text-white hover:text-orange-500 transition"
          >
            <FiShoppingCart size={26} />
            {cantidadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cantidadTotal}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuAbierto((v) => !v)}
            className="md:hidden p-2 text-white"
          >
            {menuAbierto ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-4 text-gray-300">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuAbierto(false)}
              className="py-2 border-b border-gray-800 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;