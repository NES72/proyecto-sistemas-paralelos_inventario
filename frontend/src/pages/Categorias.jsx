import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', estado: true });
  const [error, setError] = useState('');

  const cargar = async () => {
    try { setCategorias(await api.categorias.listar()); }
    catch (e) { setError(e.message); }
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.categorias.actualizar(editando.id, form);
      } else {
        await api.categorias.crear(form);
      }
      setShowForm(false);
      setEditando(null);
      setForm({ nombre: '', descripcion: '', estado: true });
      cargar();
    } catch (e) { setError(e.message); }
  };

  const eliminar = async (id) => {
    if (!confirm('Eliminar esta categoria?')) return;
    try { await api.categorias.eliminar(id); cargar(); }
    catch (e) { setError(e.message); }
  };

  const abrirEditar = (cat) => {
    setEditando(cat);
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '', estado: cat.estado });
    setShowForm(true);
  };

  return (
    <div className="page">
      <div className="section-header">
        <h1>Categorias</h1>
        <button className="btn btn-primary" onClick={() => { setEditando(null); setForm({ nombre: '', descripcion: '', estado: true }); setShowForm(true); }}>
          + Nueva Categoria
        </button>
      </div>

      {error && <div className="alert alert-error">{error}<button onClick={() => setError('')} style={{marginLeft:8,background:'none',border:'none',cursor:'pointer'}}>x</button></div>}

      <div className="table-container">
        <table>
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Descripcion</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {categorias.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.nombre}</td>
                <td>{cat.descripcion || '-'}</td>
                <td><span className={`badge ${cat.estado ? 'badge-success' : 'badge-danger'}`}>{cat.estado ? 'Activa' : 'Inactiva'}</span></td>
                <td>
                  <button className="btn btn-secondary" onClick={() => abrirEditar(cat)} style={{marginRight:4}}>Editar</button>
                  <button className="btn btn-danger" onClick={() => eliminar(cat.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && <tr><td colSpan={5} className="empty">No hay categorias</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editando ? 'Editar Categoria' : 'Nueva Categoria'}</h2>
            <form onSubmit={guardar}>
              <div className="form-group">
                <label>Nombre</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Descripcion</label>
                <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={form.estado} onChange={e => setForm({...form, estado: e.target.checked})} /> Activa
                </label>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">{editando ? 'Actualizar' : 'Crear'}</button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
