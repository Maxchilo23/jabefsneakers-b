import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <span className={styles.eyebrow}>JabefSneakers</span>
        <span className={styles.eyebrow}>Lima, Perú</span>
      </div>
      <p className={styles.copy}>© {new Date().getFullYear()} JabefSneakers. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;