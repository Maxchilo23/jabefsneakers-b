function SelectorTalla({ tallas, tallaSeleccionada, onSeleccionar }) {
  if (!tallas || tallas.length === 0) {
    return <p className="text-gray-400 text-sm">Sin tallas disponibles</p>;
  }

  return (
    <div>
      <p className="text-white font-semibold mb-2">Selecciona una talla</p>
      <div className="flex gap-2 flex-wrap">
        {tallas.map((pt) => {
          const sinStock = pt.stock <= 0;
          const seleccionada = tallaSeleccionada === pt.talla.valor;

          return (
            <button
              key={pt.id}
              disabled={sinStock}
              onClick={() => onSeleccionar(pt.talla.valor)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium border transition
                ${sinStock ? 'opacity-40 cursor-not-allowed border-gray-700 text-gray-500' : ''}
                ${
                  !sinStock && seleccionada
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : !sinStock
                    ? 'border-gray-600 text-gray-200 hover:border-orange-500'
                    : ''
                }
              `}
            >
              {pt.talla.valor}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SelectorTalla;