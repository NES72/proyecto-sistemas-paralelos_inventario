import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Categorias from './pages/Categorias';
import Productos from './pages/Productos';
import Movimientos from './pages/Movimientos';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import CambiarPassword from './pages/CambiarPassword';
import { getToken, useAuth, AuthProvider } from './services/AuthContext';
import { api } from './services/api';

function RequiereAuth({ children }) {
  const location = useLocation();
  if (!getToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    api.auth.logout().catch(() => {});
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">FerroStock</div>
      {auth && (
        <>
          <div className="navbar-links">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/categorias">Categorias</NavLink>
            <NavLink to="/productos">Productos</NavLink>
            <NavLink to="/movimientos">Movimientos</NavLink>
          </div>
          <div className="navbar-user">
            <span>{auth.usuario.usuario} · {auth.usuario.rol === 'ADMINISTRADOR' ? 'Admin' : 'Operador'}</span>
            <NavLink to="/cambiar-password" className="btn-link">Contrasena</NavLink>
            <button type="button" className="btn-link" onClick={cerrarSesion}>Salir</button>
          </div>
        </>
      )}
    </nav>
  );
}

function Inicio() {
  const { auth } = useAuth();
  return (
    <div className="page">
      <h1>FerroStock</h1>
      <p className="subtitle">Control de stock y movimientos de la ferreteria</p>
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
        {auth?.usuario.rol === 'ADMINISTRADOR' && (
          <NavLink to="/usuarios" className="card">
            <h3>Usuarios</h3>
            <p>Gestionar cuentas de acceso al sistema</p>
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequiereAuth><Inicio /></RequiereAuth>} />
            <Route path="/categorias" element={<RequiereAuth><Categorias /></RequiereAuth>} />
            <Route path="/productos" element={<RequiereAuth><Productos /></RequiereAuth>} />
            <Route path="/movimientos" element={<RequiereAuth><Movimientos /></RequiereAuth>} />
            <Route path="/usuarios" element={<RequiereAuth><Usuarios /></RequiereAuth>} />
            <Route path="/cambiar-password" element={<RequiereAuth><CambiarPassword /></RequiereAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}