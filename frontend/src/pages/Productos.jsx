import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { getAuth } from '../services/auth';

const FORM_VACIO = { codigo: '', nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '5', estado: true, categoriaId: '' };

function sugerirCodigo(productos) {
  const max = productos.reduce((acc, p) => {
    const m = /^FER-(\d+)$/.exec(p.codigo);
    return m ? Math.max(acc, Number(m[1])) : acc;
  }, 0);
  return `FER-${String(max + 1).padStart(4, '0')}`;
}

function stockInfo(stock, minimo) {
  if (stock === 0) return { clase: 'badge-danger', etiqueta: 'Sin stock' };
  if (stock <= minimo) return { clase: 'badge-warning', etiqueta: 'Stock bajo' };
  return { clase: 'badge-success', etiqueta: String(stock) };
}

function formatearFecha(valor) {
  if (!valor) return '-';
  return new Date(valor).toLocaleString('es-PE');
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [soloBajo, setSoloBajo] = useState(false);
  const [detalle, setDetalle] = useState(null);

  const esAdmin = getAuth()?.usuario.rol === 'ADMINISTRADOR';

  const notificar = (msg) => { setMensaje(msg); setTimeout(() => setMensaje(''), 4000); };

  const cargar = async () => {
    try {
      const [prods, cats] = await Promise.all([api.productos.listar(), api.categorias.listar()]);
      setProductos(prods);
      setCategorias(cats);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = productos.filter((p) => {
    const q = busqueda.trim().toLowerCase();
    const coincideTexto = !q || p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q);
    const coincideCategoria = !categoriaFiltro || String(p.categoriaId) === categoriaFiltro;
    const coincideStock = !soloBajo || p.stock <= p.stockMinimo;
    return coincideTexto && coincideCategoria && coincideStock;
  });

  const valorTotal = productos.reduce((acc, p) => acc + Number(p.precio) * p.stock, 0);
  const conStockBajo = productos.filter((p) => p.stock <= p.stockMinimo).length;

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ ...FORM_VACIO, codigo: sugerirCodigo(productos) });
    setShowForm(true);
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

  const guardar = async (e) => {
    e.preventDefault();
    try {
      const datos = {
        ...form,
        precio: Number(form.precio),
        stockMinimo: Number(form.stockMinimo),
        categoriaId: Number(form.categoriaId)
      };
      if (!editando) {
        datos.stock = form.stock !== '' ? Number(form.stock) : 0;
      }
      if (editando) {
        await api.productos.actualizar(editando.id, datos);
        notificar('Producto actualizado');
      } else {
        await api.productos.crear(datos);
        notificar('Producto creado correctamente');
      }
      setShowForm(false);
      setForm(FORM_VACIO);
      cargar();
    } catch (e) { setError(e.message); }
  };

  const eliminar = async (id) => {
    if (!window.confirm('Eliminar este producto?')) return;
    try { await api.productos.eliminar(id); notificar('Producto eliminado'); cargar(); }
    catch (e) { setError(e.message); }
  };

  const cambiarEstado = async (prod) => {
    try {
      await api.productos.actualizar(prod.id, {
        codigo: prod.codigo, nombre: prod.nombre, descripcion: prod.descripcion || null,
        precio: prod.precio, stock: prod.stock, stockMinimo: prod.stockMinimo,
        estado: !prod.estado, categoriaId: prod.categoriaId
      });
      notificar(prod.estado ? 'Producto desactivado' : 'Producto activado');
      cargar();
    } catch (e) { setError(e.message); }
  };

  const verDetalle = async (prod) => {
    setDetalle({ ...prod, movimientos: null, cargando: true });
    try {
      const movs = await api.movimientos.listar({ productoId: prod.id });
      setDetalle((d) => (d && d.id === prod.id ? { ...d, movimientos: movs, cargando: false } : d));
    } catch (e) {
      setError(e.message);
      setDetalle((d) => (d && d.id === prod.id ? { ...d, cargando: false } : d));
    }
  };

  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre || '-';

  return (
    <div className="page">
      <div className="section-header">
        <h1>Productos</h1>
        {esAdmin && <button className="btn btn-primary" onClick={abrirNuevo}>+ Nuevo Producto</button>}
      </div>

      <div className="summary-bar">
        <div className="summary-item">
          <span className="summary-label">Productos mostrados</span>
          <span className="summary-value">{filtrados.length} / {productos.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Valor total del inventario</span>
          <span className="summary-value">S/ {valorTotal.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Con stock bajo</span>
          <span className="summary-value">{conStockBajo}</span>
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}<button onClick={() => setError('')} style={{marginLeft:8,background:'none',border:'none',cursor:'pointer'}}>x</button></div>}

      <div className="filters">
        <input
          className="filter-search"
          type="search"
          placeholder="Buscar por codigo o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select className="filter-select" value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
          <option value="">Todas las categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <label className="filter-checkbox">
          <input type="checkbox" checked={soloBajo} onChange={(e) => setSoloBajo(e.target.checked)} /> Solo stock bajo
        </label>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Codigo</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Minimo</th><th>Valor (S/)</th><th>Categoria</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtrados.map((prod) => {
              const stock = stockInfo(prod.stock, prod.stockMinimo);
              return (
                <tr key={prod.id}>
                  <td>{prod.codigo}</td>
                  <td>{prod.nombre}</td>
                  <td>S/ {Number(prod.precio).toFixed(2)}</td>
                  <td><span className={`badge ${stock.clase}`}>{stock.etiqueta}</span></td>
                  <td>{prod.stockMinimo}</td>
                  <td>S/ {(Number(prod.precio) * prod.stock).toFixed(2)}</td>
                  <td>{nombreCategoria(prod.categoriaId)}</td>
                  <td><span className={`badge ${prod.estado ? 'badge-success' : 'badge-danger'}`}>{prod.estado ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-secondary" onClick={() => verDetalle(prod)}>Detalle</button>
                      {esAdmin && (
                        <>
                          <button className="btn btn-secondary" onClick={() => abrirEditar(prod)}>Editar</button>
                          <button className={`btn ${prod.estado ? 'btn-secondary' : 'btn-primary'}`} onClick={() => cambiarEstado(prod)}>
                            {prod.estado ? 'Desactivar' : 'Activar'}
                          </button>
                          <button className="btn btn-danger" onClick={() => eliminar(prod.id)}>Eliminar</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtrados.length === 0 && <tr><td colSpan={9} className="empty">No hay productos que coincidan</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={guardar}>
              <div className="form-group">
                <label>Codigo</label>
                <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Descripcion</label>
                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" step="0.01" min="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
              </div>
              {editando ? (
                <div className="form-group">
                  <label>Stock actual</label>
                  <input type="number" value={form.stock} disabled />
                  <small className="help-text">El stock solo se modifica registrando movimientos (ENTRADA/SALIDA/AJUSTE).</small>
                </div>
              ) : (
                <div className="form-group">
                  <label>Stock inicial</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                  <small className="help-text">Si es mayor a 0 se registra automaticamente como ENTRADA.</small>
                </div>
              )}
              <div className="form-group">
                <label>Stock Minimo</label>
                <input type="number" min="0" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <select value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })} required>
                  <option value="">Seleccionar...</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.checked })} /> Activo
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

      {detalle && (
        <div className="modal-overlay" onClick={() => setDetalle(null)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="section-header">
              <h2>Detalle de {detalle.nombre}</h2>
              <button className="btn btn-secondary" type="button" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>

            <div className="detail-grid">
              <div><span className="detail-label">Codigo</span><span>{detalle.codigo}</span></div>
              <div><span className="detail-label">Categoria</span><span>{nombreCategoria(detalle.categoriaId)}</span></div>
              <div><span className="detail-label">Precio</span><span>S/ {Number(detalle.precio).toFixed(2)}</span></div>
              <div><span className="detail-label">Stock</span><span>{detalle.stock}</span></div>
              <div><span className="detail-label">Stock minimo</span><span>{detalle.stockMinimo}</span></div>
              <div><span className="detail-label">Valor (precio x stock)</span><span>S/ {(Number(detalle.precio) * detalle.stock).toFixed(2)}</span></div>
              <div><span className="detail-label">Estado</span><span>{detalle.estado ? 'Activo' : 'Inactivo'}</span></div>
              <div><span className="detail-label">Creado</span><span>{formatearFecha(detalle.createdAt)}</span></div>
              <div><span className="detail-label">Actualizado</span><span>{formatearFecha(detalle.updatedAt)}</span></div>
              {detalle.descripcion && <div className="detail-full"><span className="detail-label">Descripcion</span><span>{detalle.descripcion}</span></div>}
            </div>

            <h3 className="detail-title">Historial de movimientos</h3>
            {detalle.cargando ? (
              <p className="empty">Cargando movimientos...</p>
            ) : !detalle.movimientos || detalle.movimientos.length === 0 ? (
              <p className="empty">Este producto aún no tiene movimientos</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Tipo</th><th>Cantidad</th><th>Motivo</th><th>Fecha</th></tr>
                  </thead>
                  <tbody>
                    {[...detalle.movimientos]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((m) => (
                        <tr key={m.id}>
                          <td>
                            <span className={`badge ${
                              m.tipo === 'ENTRADA' ? 'badge-success'
                              : m.tipo === 'SALIDA' ? 'badge-danger'
                              : 'badge-warning'
                            }`}>{m.tipo}</span>
                          </td>
                          <td>{m.cantidad}</td>
                          <td>{m.motivo || '-'}</td>
                          <td>{formatearFecha(m.createdAt)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}