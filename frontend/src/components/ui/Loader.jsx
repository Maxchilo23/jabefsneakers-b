function Loader({ texto = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">{texto}</p>
    </div>
  );
}

export default Loader;