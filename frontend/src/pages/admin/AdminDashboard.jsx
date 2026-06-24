import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../../services/auth.service';
import { obtenerProductos } from '../../services/producto.service';
import { eliminarProducto } from '../../services/admin.service';
import ProductoForm from '../../components/admin/ProductoForm';
import ProductoTabla from '../../components/admin/ProductoTabla';

function AdminDashboard() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargarProductos() {
    setCargando(true);
    const data = await obtenerProductos();
    setProductos(data);
    setCargando(false);
  }

  useEffect(() => {
    cargarProductos();
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
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      {mostrarForm ? (
        <ProductoForm
          productoEditar={productoEditar}
          onGuardado={handleGuardado}
          onCancelar={() => setMostrarForm(false)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Productos</h2>
            <button
              onClick={handleNuevoProducto}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              + Nuevo producto
            </button>
          </div>

          {cargando ? (
            <p className="text-gray-400 text-center py-8">Cargando productos...</p>
          ) : (
            <ProductoTabla
              productos={productos}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;