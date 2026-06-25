import { useState } from 'react';
import { crearCategoria } from '../../services/admin.service';
import styles from './CategoriaForm.module.css';

function CategoriaForm({ onGuardado }) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  function generarSlug(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      await crearCategoria({ nombre, slug: generarSlug(nombre) });
      setNombre('');
      onGuardado();
    } catch (err) {
      console.error(err);
      setError('Ya existe esa categoría');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Nombre de la nueva categoría"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className={styles.input}
      />
      <button type="submit" disabled={guardando} className={styles.btn}>
        {guardando ? 'Creando...' : 'Crear'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

export default CategoriaForm;