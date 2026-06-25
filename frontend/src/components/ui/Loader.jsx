import styles from './Loader.module.css';

function Loader({ texto = 'Cargando...' }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} />
      <p className={styles.text}>{texto}</p>
    </div>
  );
}

export default Loader;