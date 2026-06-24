import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-orange-500 mb-2">404</h1>
      <p className="text-xl text-white mb-2">Página no encontrada</p>
      <p className="text-gray-400 mb-6">
        Lo que buscas no existe o fue movido.
      </p>
      <Link
        to="/catalogo"
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition"
      >
        Ir al catálogo
      </Link>
    </div>
  );
}

export default NotFound;