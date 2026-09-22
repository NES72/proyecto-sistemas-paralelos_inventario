const TIPOS_MOVIMIENTO = ['ENTRADA', 'SALIDA', 'AJUSTE'];
const ROLES = ['ADMINISTRADOR', 'OPERADOR'];

export function validarCategoria(body) {
  const errores = [];

  if (!body.nombre || typeof body.nombre !== 'string' || body.nombre.trim() === '') {
    errores.push('nombre es requerido y debe ser un string');
  }

  if (body.descripcion !== undefined && body.descripcion !== null && typeof body.descripcion !== 'string') {
    errores.push('descripcion debe ser un string');
  }

  return errores;
}

export function validarProducto(body) {
  const errores = [];

  if (!body.codigo || typeof body.codigo !== 'string' || body.codigo.trim() === '') {
    errores.push('codigo es requerido');
  }

  if (!body.nombre || typeof body.nombre !== 'string' || body.nombre.trim() === '') {
    errores.push('nombre es requerido');
  }

  if (body.precio === undefined || body.precio === null || typeof body.precio !== 'number' || body.precio < 0) {
    errores.push('precio es requerido y debe ser un numero >= 0');
  }

  if (body.stock !== undefined && (typeof body.stock !== 'number' || body.stock < 0)) {
    errores.push('stock debe ser un numero >= 0');
  }

  if (body.stockMinimo !== undefined && (typeof body.stockMinimo !== 'number' || body.stockMinimo < 0)) {
    errores.push('stockMinimo debe ser un numero >= 0');
  }

  if (body.categoriaId === undefined || body.categoriaId === null || typeof body.categoriaId !== 'number') {
    errores.push('categoriaId es requerido y debe ser un numero');
  }

  return errores;
}

export function validarMovimiento(body) {
  const errores = [];

  if (!body.tipo || !TIPOS_MOVIMIENTO.includes(body.tipo)) {
    errores.push(`tipo es requerido y debe ser: ${TIPOS_MOVIMIENTO.join(', ')}`);
  }

  if (!body.cantidad || typeof body.cantidad !== 'number' || body.cantidad <= 0) {
    errores.push('cantidad es requerida y debe ser un numero > 0');
  }

  if (body.productoId === undefined || body.productoId === null || typeof body.productoId !== 'number') {
    errores.push('productoId es requerido y debe ser un numero');
  }

  if (body.tipo === 'AJUSTE' && (!body.motivo || typeof body.motivo !== 'string' || body.motivo.trim() === '')) {
    errores.push('motivo es requerido para movimientos de tipo AJUSTE');
  }

  return errores;
}

export function validarLogin(body) {
  const errores = [];

  if (!body.usuario || typeof body.usuario !== 'string' || body.usuario.trim() === '') {
    errores.push('usuario es requerido');
  }

  if (!body.password || typeof body.password !== 'string' || body.password.trim() === '') {
    errores.push('password es requerida');
  }

  return errores;
}

export function validarUsuario(body) {
  const errores = [];

  if (!body.nombre || typeof body.nombre !== 'string' || body.nombre.trim() === '') {
    errores.push('nombre es requerido');
  }

  if (!body.usuario || typeof body.usuario !== 'string' || body.usuario.trim() === '') {
    errores.push('usuario es requerido');
  }

  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errores.push('password es requerida y debe tener al menos 6 caracteres');
  }

  if (body.rol !== undefined && body.rol !== null && !ROLES.includes(body.rol)) {
    errores.push(`rol debe ser: ${ROLES.join(', ')}`);
  }

  return errores;
}

export function validarCambioPassword(body) {
  const errores = [];

  if (!body.passwordActual || typeof body.passwordActual !== 'string' || body.passwordActual.trim() === '') {
    errores.push('passwordActual es requerida');
  }

  if (!body.nuevaPassword || typeof body.nuevaPassword !== 'string' || body.nuevaPassword.length < 6) {
    errores.push('nuevaPassword es requerida y debe tener al menos 6 caracteres');
  }

  return errores;
}
