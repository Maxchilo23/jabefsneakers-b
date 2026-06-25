import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import useCarritoStore from '../../store/carritoStore';
import logo from '../../assets/logo.png';
import styles from './Navbar.module.css';

function Navbar({ onAbrirCarrito }) {
  const cantidadTotal = useCarritoStore((state) => state.obtenerCantidadTotal());
  const [menuAbierto, setMenuAbierto] = useState(false);

  const links = [
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/catalogo?categoria=zapatillas', label: 'Zapatillas' },
    { to: '/catalogo?categoria=ropa', label: 'Ropa' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/">
          <img src={logo} alt="JabefSneakers" className={styles.logo} />
        </Link>

        <div className={styles.links}>
          {links.map((link) => (
            <Link key={link.label} to={link.to} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </div>

        <button onClick={onAbrirCarrito} aria-label="Carrito">
          <FiShoppingCart size={22} color="#EEEEEE" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;