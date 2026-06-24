import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Catalogo from '../pages/Catalogo';
import ProductoDetalle from '../pages/ProductoDetalle';
import NotFound from '../pages/NotFound';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import RutaProtegida from '../components/admin/RutaProtegida';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/producto/:id" element={<ProductoDetalle />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <RutaProtegida>
            <AdminDashboard />
          </RutaProtegida>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;