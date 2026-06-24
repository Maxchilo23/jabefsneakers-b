function FiltroTalla({ tallas, tallaActiva, onSeleccionar }) {
  if (!tallas || tallas.length === 0) return null;

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button
        onClick={() => onSeleccionar('')}
        className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
          !tallaActiva
            ? 'bg-orange-500 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        Todas las tallas
      </button>
      {tallas.map((talla) => (
        <button
          key={talla.id}
          onClick={() => onSeleccionar(talla.valor)}
          className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
            tallaActiva === talla.valor
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {talla.valor}
        </button>
      ))}
    </div>
  );
}

export default FiltroTalla;