import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { obtenerProductos } from '../services/producto.service';
import { obtenerCategorias } from '../services/categoria.service';
import { obtenerTallas } from '../services/talla.service';
import ProductoGrid from '../components/catalogo/ProductoGrid';
import Loader from '../components/ui/Loader';
import styles from './Catalogo.module.css';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoriaSlug = searchParams.get('categoria');
  const tallaActiva = searchParams.get('talla') || '';

  useEffect(() => {
    obtenerCategorias().then(setCategorias).catch(console.error);
    obtenerTallas().then(setTallas).catch(console.error);
  }, []);

  useEffect(() => {
    const categoriaSeleccionada = categorias.find((c) => c.slug === categoriaSlug);
    const timeout = setTimeout(() => {
      setCargando(true);
      obtenerProductos({
        categoriaId: categoriaSeleccionada?.id,
        busqueda: busqueda.trim() || undefined,
        talla: tallaActiva || undefined,
      })
        .then(setProductos)
        .catch(console.error)
        .finally(() => setCargando(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [categoriaSlug, categorias, busqueda, tallaActiva]);

  function handleVerDetalle(producto) {
    navigate(`/producto/${producto.id}`);
  }

  function handleCambiarCategoria(slug) {
    const params = {};
    if (slug) params.categoria = slug;
    if (tallaActiva) params.talla = tallaActiva;
    setSearchParams(params);
  }

  function handleCambiarTalla(valor) {
    const params = {};
    if (categoriaSlug) params.categoria = categoriaSlug;
    if (valor) params.talla = valor;
    setSearchParams(params);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Catálogo</h1>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className={styles.search}
      />

      <div className={styles.filters}>
        <button
          onClick={() => handleCambiarCategoria('')}
          className={`${styles.filterBtn} ${!categoriaSlug ? styles.filterBtnActive : ''}`}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCambiarCategoria(cat.slug)}
            className={`${styles.filterBtn} ${categoriaSlug === cat.slug ? styles.filterBtnActive : ''}`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <div className={styles.filters}>
        <button
          onClick={() => handleCambiarTalla('')}
          className={`${styles.filterBtn} ${!tallaActiva ? styles.filterBtnActive : ''}`}
        >
          Todas las tallas
        </button>
        {tallas.map((talla) => (
          <button
            key={talla.id}
            onClick={() => handleCambiarTalla(talla.valor)}
            className={`${styles.filterBtn} ${tallaActiva === talla.valor ? styles.filterBtnActive : ''}`}
          >
            {talla.valor}
          </button>
        ))}
      </div>

      {cargando ? (
        <Loader texto="Cargando productos..." />
      ) : (
        <ProductoGrid productos={productos} onVerDetalle={handleVerDetalle} />
      )}
    </div>
  );
}

export default Catalogo;