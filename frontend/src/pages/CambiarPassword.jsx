import { useState } from 'react';
import { api } from '../services/api';

export default function CambiarPassword() {
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [repetir, setRepetir] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setExito('');

    if (nuevaPassword !== repetir) {
      setError('Las contrasenas nuevas no coinciden');
      return;
    }

    setCargando(true);
    try {
      await api.auth.cambiarPassword({ passwordActual, nuevaPassword });
      setPasswordActual('');
      setNuevaPassword('');
      setRepetir('');
      setExito('Contrasena actualizada correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="page login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Cambiar contrasena</h1>
        <p className="subtitle">Actualiza tu contrasena de acceso</p>

        {error && <div className="alert alert-error">{error}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}

        <div className="form-group">
          <label>Contrasena actual</label>
          <input type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} required autoFocus />
        </div>

        <div className="form-group">
          <label>Nueva contrasena</label>
          <input type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} minLength={6} required />
        </div>

        <div className="form-group">
          <label>Repetir nueva contrasena</label>
          <input type="password" value={repetir} onChange={(e) => setRepetir(e.target.value)} minLength={6} required />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Actualizar contrasena'}
        </button>
      </form>
    </div>
  );
}