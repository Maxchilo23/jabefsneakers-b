import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <p className={styles.msg}>Lo que buscas no existe o fue movido.</p>
      <Link to="/catalogo" className={styles.cta}>Ir al catálogo</Link>
    </div>
  );
}

export default NotFound;