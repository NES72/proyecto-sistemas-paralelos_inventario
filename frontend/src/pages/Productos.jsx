import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ codigo: '', nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '5', estado: true, categoriaId: '' });
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const [prods, cats] = await Promise.all([api.productos.listar(), api.categorias.listar()]);
      setProductos(prods);
      setCategorias(cats);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      const datos = {
        ...form,
        precio: Number(form.precio),
        stock: form.stock !== '' ? Number(form.stock) : 0,
        stockMinimo: Number(form.stockMinimo),
        categoriaId: Number(form.categoriaId)
      };
      if (editando) {
        await api.productos.actualizar(editando.id, datos);
      } else {
        await api.productos.crear(datos);
      }
      setShowForm(false);
      setEditando(null);
      setForm({ codigo: '', nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '5', estado: true, categoriaId: '' });
      cargar();
    } catch (e) { setError(e.message); }
  };

  const eliminar = async (id) => {
    if (!confirm('Eliminar este producto?')) return;
    try { await api.productos.eliminar(id); cargar(); }
    catch (e) { setError(e.message); }
  };

  const abrirEditar = (prod) => {
    setEditando(prod);
    setForm({
      codigo: prod.codigo, nombre: prod.nombre, descripcion: prod.descripcion || '',
      precio: String(prod.precio), stock: String(prod.stock), stockMinimo: String(prod.stockMinimo),
      estado: prod.estado, categoriaId: String(prod.categoriaId)
    });
    setShowForm(true);
  };

  const nombreCategoria = (id) => categorias.find(c => c.id === id)?.nombre || '-';

  return (
    <div className="page">
      <div className="section-header">
        <h1>Productos</h1>
        <button className="btn btn-primary" onClick={() => { setEditando(null); setForm({ codigo: '', nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '5', estado: true, categoriaId: '' }); setShowForm(true); }}>
          + Nuevo Producto
        </button>
      </div>

      {error && <div className="alert alert-error">{error}<button onClick={() => setError('')} style={{marginLeft:8,background:'none',border:'none',cursor:'pointer'}}>x</button></div>}

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Codigo</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Minimo</th><th>Categoria</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.id}>
                <td>{prod.codigo}</td>
                <td>{prod.nombre}</td>
                <td>S/ {Number(prod.precio).toFixed(2)}</td>
                <td><span className={`badge ${prod.stock <= prod.stockMinimo ? 'badge-warning' : 'badge-success'}`}>{prod.stock}</span></td>
                <td>{prod.stockMinimo}</td>
                <td>{nombreCategoria(prod.categoriaId)}</td>
                <td><span className={`badge ${prod.estado ? 'badge-success' : 'badge-danger'}`}>{prod.estado ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                  <button className="btn btn-secondary" onClick={() => abrirEditar(prod)} style={{marginRight:4}}>Editar</button>
                  <button className="btn btn-danger" onClick={() => eliminar(prod.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && <tr><td colSpan={8} className="empty">No hay productos</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={guardar}>
              <div className="form-group">
                <label>Codigo</label>
                <input value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Descripcion</label>
                <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" step="0.01" min="0" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Stock Minimo</label>
                <input type="number" min="0" value={form.stockMinimo} onChange={e => setForm({...form, stockMinimo: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <select value={form.categoriaId} onChange={e => setForm({...form, categoriaId: e.target.value})} required>
                  <option value="">Seleccionar...</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={form.estado} onChange={e => setForm({...form, estado: e.target.checked})} /> Activo
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
