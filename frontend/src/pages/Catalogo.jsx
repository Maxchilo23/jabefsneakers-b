import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { obtenerProductos } from '../services/producto.service';
import { obtenerCategorias } from '../services/categoria.service';
import { obtenerTallas } from '../services/talla.service';
import ProductoGrid from '../components/catalogo/ProductoGrid';
import Buscador from '../components/catalogo/Buscador';
import FiltroTalla from '../components/catalogo/FiltroTalla';
import Loader from '../components/ui/Loader';

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

  // Debounce de la búsqueda (espera 400ms después de que el usuario deja de escribir)
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Catálogo</h1>

      <Buscador valor={busqueda} onCambiar={setBusqueda} />

      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => handleCambiarCategoria('')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            !categoriaSlug
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCambiarCategoria(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              categoriaSlug === cat.slug
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <FiltroTalla
        tallas={tallas}
        tallaActiva={tallaActiva}
        onSeleccionar={handleCambiarTalla}
      />

      {cargando ? (
  <Loader texto="Cargando productos..." />
) : (
  <ProductoGrid productos={productos} onVerDetalle={handleVerDetalle} />
)}
    </div>
  );
}

export default Catalogo;