import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Categorias from './pages/Categorias';
import Productos from './pages/Productos';
import Movimientos from './pages/Movimientos';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Inventario</div>
      <div className="navbar-links">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/categorias">Categorias</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/movimientos">Movimientos</NavLink>
      </div>
    </nav>
  );
}

function Inicio() {
  return (
    <div className="page">
      <h1>Sistema de Gestion de Inventario</h1>
      <p className="subtitle">Control de stock y movimientos</p>
      <div className="cards">
        <NavLink to="/categorias" className="card">
          <h3>Categorias</h3>
          <p>Gestionar categorias de productos</p>
        </NavLink>
        <NavLink to="/productos" className="card">
          <h3>Productos</h3>
          <p>Gestionar productos del inventario</p>
        </NavLink>
        <NavLink to="/movimientos" className="card">
          <h3>Movimientos</h3>
          <p>Registrar entradas, salidas y ajustes</p>
        </NavLink>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/movimientos" element={<Movimientos />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
