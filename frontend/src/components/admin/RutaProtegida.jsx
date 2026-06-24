import { Navigate } from 'react-router-dom';
import { estaAutenticado } from '../../services/auth.service';

function RutaProtegida({ children }) {
  if (!estaAutenticado()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default RutaProtegida;