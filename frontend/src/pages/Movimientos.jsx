import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tipo: 'ENTRADA', cantidad: '', motivo: '', productoId: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const cargar = async () => {
    try {
      const [movs, prods] = await Promise.all([api.movimientos.listar(), api.productos.listar()]);
      setMovimientos(movs);
      setProductos(prods);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { cargar(); }, []);

  const crear = async (e) => {
    e.preventDefault();
    try {
      const datos = { ...form, cantidad: Number(form.cantidad), productoId: Number(form.productoId) };
      const resultado = await api.movimientos.crear(datos);
      setShowForm(false);
      setForm({ tipo: 'ENTRADA', cantidad: '', motivo: '', productoId: '' });
      setExito(`${form.tipo} registrada. Stock nuevo: ${resultado.nuevoStock}`);
      setError('');
      cargar();
      setTimeout(() => setExito(''), 3000);
    } catch (e) { setError(e.message); setExito(''); }
  };

  const nombreProducto = (id) => productos.find(p => p.id === id)?.nombre || '-';
  const tipoBadge = (tipo) => {
    const cls = tipo === 'ENTRADA' ? 'badge-success' : tipo === 'SALIDA' ? 'badge-danger' : 'badge-info';
    return <span className={`badge ${cls}`}>{tipo}</span>;
  };

  const fecha = (str) => {
    if (!str) return '-';
    return new Date(str).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="page">
      <div className="section-header">
        <h1>Movimientos de Inventario</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ tipo: 'ENTRADA', cantidad: '', motivo: '', productoId: '' }); setShowForm(true); }}>
          + Nuevo Movimiento
        </button>
      </div>

      {error && <div className="alert alert-error">{error}<button onClick={() => setError('')} style={{marginLeft:8,background:'none',border:'none',cursor:'pointer'}}>x</button></div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr><th>ID</th><th>Fecha</th><th>Tipo</th><th>Producto</th><th>Cantidad</th><th>Motivo</th></tr>
          </thead>
          <tbody>
            {movimientos.map(mov => (
              <tr key={mov.id}>
                <td>{mov.id}</td>
                <td>{fecha(mov.createdAt)}</td>
                <td>{tipoBadge(mov.tipo)}</td>
                <td>{nombreProducto(mov.productoId)}</td>
                <td>{mov.cantidad}</td>
                <td>{mov.motivo || '-'}</td>
              </tr>
            ))}
            {movimientos.length === 0 && <tr><td colSpan={6} className="empty">No hay movimientos</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo Movimiento</h2>
            <form onSubmit={crear}>
              <div className="form-group">
                <label>Tipo</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} required>
                  <option value="ENTRADA">ENTRADA</option>
                  <option value="SALIDA">SALIDA</option>
                  <option value="AJUSTE">AJUSTE</option>
                </select>
              </div>
              <div className="form-group">
                <label>Producto</label>
                <select value={form.productoId} onChange={e => setForm({...form, productoId: e.target.value})} required>
                  <option value="">Seleccionar...</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.codigo} - {p.nombre} (stock: {p.stock})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Cantidad</label>
                <input type="number" min="1" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Motivo {form.tipo === 'AJUSTE' && '(requerido)'}</label>
                <textarea value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Registrar</button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
