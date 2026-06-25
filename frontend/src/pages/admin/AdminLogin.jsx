import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, guardarToken } from '../../services/auth.service';
import styles from './AdminLogin.module.css';

function AdminLogin() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const data = await login(usuario, password);
      guardarToken(data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <span className={styles.eyebrow}>Acceso restringido</span>
        <h1 className={styles.title}>Panel Admin</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={cargando} className={styles.cta}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;