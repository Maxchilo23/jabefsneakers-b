import { useEffect } from 'react';
import styles from './Lightbox.module.css';

function Lightbox({ imagenes, indiceActivo, onCerrar, onCambiarIndice }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onCerrar();
      if (e.key === 'ArrowRight') onCambiarIndice((indiceActivo + 1) % imagenes.length);
      if (e.key === 'ArrowLeft') onCambiarIndice((indiceActivo - 1 + imagenes.length) % imagenes.length);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [indiceActivo, imagenes.length, onCerrar, onCambiarIndice]);

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <button className={styles.close} onClick={onCerrar}>Cerrar ✕</button>

      {imagenes.length > 1 && (
        <button
          className={`${styles.nav} ${styles.navPrev}`}
          onClick={(e) => {
            e.stopPropagation();
            onCambiarIndice((indiceActivo - 1 + imagenes.length) % imagenes.length);
          }}
        >
          ‹
        </button>
      )}

      <img
        src={imagenes[indiceActivo]}
        alt={`Vista ${indiceActivo + 1}`}
        className={styles.image}
        onClick={(e) => e.stopPropagation()}
      />

      {imagenes.length > 1 && (
        <button
          className={`${styles.nav} ${styles.navNext}`}
          onClick={(e) => {
            e.stopPropagation();
            onCambiarIndice((indiceActivo + 1) % imagenes.length);
          }}
        >
          ›
        </button>
      )}

      {imagenes.length > 1 && (
        <span className={styles.counter}>{indiceActivo + 1} / {imagenes.length}</span>
      )}
    </div>
  );
}

export default Lightbox;