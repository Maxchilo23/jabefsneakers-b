import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../../services/auth.service';
import { obtenerProductos } from '../../services/producto.service';
import { obtenerCategorias } from '../../services/categoria.service';
import { eliminarProducto } from '../../services/admin.service';
import ProductoForm from '../../components/admin/ProductoForm';
import ProductoTabla from '../../components/admin/ProductoTabla';
import CategoriaForm from '../../components/admin/CategoriaForm';
import Loader from '../../components/ui/Loader';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [pestanaActiva, setPestanaActiva] = useState('productos');

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargarProductos() {
    setCargando(true);
    const data = await obtenerProductos();
    setProductos(data);
    setCargando(false);
  }

  async function cargarCategorias() {
    const data = await obtenerCategorias();
    setCategorias(data);
  }

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  function handleLogout() {
    cerrarSesion();
    navigate('/admin/login');
  }

  function handleNuevoProducto() {
    setProductoEditar(null);
    setMostrarForm(true);
  }

  function handleEditar(producto) {
    setProductoEditar(producto);
    setMostrarForm(true);
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
      cargarProductos();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el producto');
    }
  }

  function handleGuardado() {
    setMostrarForm(false);
    setProductoEditar(null);
    cargarProductos();
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de administración</h1>
        <button onClick={handleLogout} className={styles.logout}>Cerrar sesión</button>
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => setPestanaActiva('productos')}
          className={`${styles.tab} ${pestanaActiva === 'productos' ? styles.tabActive : ''}`}
        >
          Productos
        </button>
        <button
          onClick={() => setPestanaActiva('categorias')}
          className={`${styles.tab} ${pestanaActiva === 'categorias' ? styles.tabActive : ''}`}
        >
          Categorías
        </button>
      </div>

      {pestanaActiva === 'productos' && (
        <>
          {mostrarForm ? (
            <ProductoForm
              productoEditar={productoEditar}
              onGuardado={handleGuardado}
              onCancelar={() => setMostrarForm(false)}
            />
          ) : (
            <>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Productos</h2>
                <button onClick={handleNuevoProducto} className={styles.addBtn}>
                  + Nuevo producto
                </button>
              </div>

              {cargando ? (
                <Loader texto="Cargando productos..." />
              ) : (
                <ProductoTabla
                  productos={productos}
                  onEditar={handleEditar}
                  onEliminar={handleEliminar}
                />
              )}
            </>
          )}
        </>
      )}

      {pestanaActiva === 'categorias' && (
        <>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '1.25rem' }}>Categorías</h2>
          <CategoriaForm onGuardado={cargarCategorias} />

          <div className={styles.categoriasGrid}>
            {categorias.map((cat) => (
              <div key={cat.id} className={styles.categoriaCard}>
                <span className={styles.categoriaNombre}>{cat.nombre}</span>
                <span className={styles.categoriaSlug}>{cat.slug}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;