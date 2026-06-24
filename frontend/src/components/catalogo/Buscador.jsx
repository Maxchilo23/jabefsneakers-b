import { FiSearch } from 'react-icons/fi';

function Buscador({ valor, onCambiar }) {
  return (
    <div className="relative mb-6">
      <FiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Buscar producto..."
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="w-full bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}

export default Buscador;