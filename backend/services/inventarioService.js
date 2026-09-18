import { getProducto, getMovimientoInventario } from '../lib/db.js';

export async function registrarMovimiento({ tipo, cantidad, motivo, productoId }) {
  const Producto = await getProducto();
  const MovimientoInventario = await getMovimientoInventario();

  const producto = await Producto.first({ id: productoId });
  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  let nuevoStock;

  switch (tipo) {
    case 'ENTRADA':
      nuevoStock = producto.stock + cantidad;
      break;

    case 'SALIDA':
      if (cantidad > producto.stock) {
        throw new Error(`Stock insuficiente. Disponible: ${producto.stock}, solicitado: ${cantidad}`);
      }
      nuevoStock = producto.stock - cantidad;
      break;

    case 'AJUSTE':
      if (!motivo || motivo.trim() === '') {
        throw new Error('El motivo es requerido para ajustes');
      }
      nuevoStock = cantidad;
      break;

    default:
      throw new Error(`Tipo de movimiento invalido: ${tipo}`);
  }

  if (nuevoStock < 0) {
    throw new Error('El stock no puede ser negativo');
  }

  await Producto.where({ id: productoId }).update({ stock: nuevoStock });

  const movimiento = await MovimientoInventario.create({
    tipo,
    cantidad,
    motivo: motivo || null,
    productoId
  });

  return { movimiento, nuevoStock };
}
