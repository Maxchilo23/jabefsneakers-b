import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Navbar from './components/layout/Navbar';
import CarritoDrawer from './components/carrito/CarritoDrawer';

function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />
        <AppRouter />
        <CarritoDrawer
          abierto={carritoAbierto}
          onCerrar={() => setCarritoAbierto(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;