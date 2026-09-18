import { Router } from 'express';
import { getMovimientoInventario, getProducto } from '../lib/db.js';
import { validarMovimiento } from '../middleware/validate.js';
import { registrarMovimiento } from '../services/inventarioService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const MovimientoInventario = await getMovimientoInventario();
    const movimientos = await MovimientoInventario.all();
    res.json(movimientos);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const MovimientoInventario = await getMovimientoInventario();
    const movimiento = await MovimientoInventario.first({ id: Number(req.params.id) });
    if (!movimiento) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json(movimiento);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const errores = validarMovimiento(req.body);
    if (errores.length) return res.status(400).json({ errores });

    const resultado = await registrarMovimiento({
      tipo: req.body.tipo,
      cantidad: req.body.cantidad,
      motivo: req.body.motivo || null,
      productoId: req.body.productoId
    });

    res.status(201).json(resultado);
  } catch (err) {
    if (err.message.includes('Stock insuficiente') || err.message.includes('Producto no encontrado')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
