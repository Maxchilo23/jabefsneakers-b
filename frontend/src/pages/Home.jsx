import { Link } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.hero}>
      <span className={styles.eyebrow}>Colección Permanente</span>

      <h1 className={styles.title}>
        Jabef<span className={styles.titleItalic}>Sneakers</span>
      </h1>

      <div className={styles.divider} />

      <p className={styles.subtitle}>
        Zapatillas, ropa y accesorios urbanos. Elige tus piezas y compra
        directo por WhatsApp, sin vueltas.
      </p>

      <Link to="/catalogo" className={styles.cta}>
        Ver catálogo
      </Link>
    </div>
  );
}

export default Home;