import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CarritoDrawer from './components/carrito/CarritoDrawer';

function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <BrowserRouter>
      <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />
      <AppRouter />
      <Footer />
      <CarritoDrawer
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
      />
    </BrowserRouter>
  );
}

export default App;