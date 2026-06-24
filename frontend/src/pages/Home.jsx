import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Jabef<span className="text-orange-500">Sneakers</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-md mb-8">
        Zapatillas, ropa y accesorios urbanos. Elige tus favoritos y compra directo por WhatsApp.
      </p>
      <Link
        to="/catalogo"
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition"
      >
        Ver catálogo
      </Link>
    </div>
  );
}

export default Home;