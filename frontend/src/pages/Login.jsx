import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { getToken, useAuth } from '../services/AuthContext';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  if (getToken()) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const data = await api.auth.login({ usuario, password });
      login(data);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="page login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>FerroStock</h1>
        <p className="subtitle">Inicia sesion para acceder al inventario</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Usuario</label>
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoFocus />
        </div>

        <div className="form-group">
          <label>Contrasena</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}