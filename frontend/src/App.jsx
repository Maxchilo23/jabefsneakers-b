import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Navbar from './components/layout/Navbar';
import CarritoDrawer from './components/carrito/CarritoDrawer';
import Footer from './components/layout/Footer';

function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />
        <AppRouter />
        <Footer />
        <CarritoDrawer
          abierto={carritoAbierto}
          onCerrar={() => setCarritoAbierto(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;