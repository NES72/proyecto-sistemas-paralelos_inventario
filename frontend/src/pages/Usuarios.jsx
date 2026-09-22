import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', usuario: '', password: '', rol: 'OPERADOR', estado: true });
  const [guardando, setGuardando] = useState(false);

  async function cargarUsuarios() {
    try {
      setCargando(true);
      setError('');
      const data = await api.auth.listarUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  function abrirModal() {
    setForm({ nombre: '', usuario: '', password: '', rol: 'OPERADOR', estado: true });
    setShowModal(true);
  }

  async function crearUsuario(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      await api.auth.crearUsuario({
        nombre: form.nombre,
        usuario: form.usuario,
        password: form.password,
        rol: form.rol,
        estado: form.estado
      });
      setShowModal(false);
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  const etiquetaRol = (rol) => (rol === 'ADMINISTRADOR' ? 'Admin' : 'Operador');

  return (
    <div className="page">
      <div className="section-header">
        <h1>Usuarios</h1>
        <button className="btn btn-primary" onClick={abrirModal}>Nuevo usuario</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {cargando ? (
        <p className="empty">Cargando...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.usuario}</td>
                  <td>
                    <span className={`badge ${u.rol === 'ADMINISTRADOR' ? 'badge-info' : 'badge-secondary'}`}>
                      {etiquetaRol(u.rol)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.estado ? 'badge-success' : 'badge-danger'}`}>
                      {u.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo usuario</h2>
            <form onSubmit={crearUsuario}>
              <div className="form-group">
                <label>Nombre completo</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Usuario</label>
                <input value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Contrasena</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                  <option value="OPERADOR">Operador</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}