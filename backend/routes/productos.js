import { Router } from 'express';
import { getProducto, getCategoria, getMovimientoInventario } from '../lib/db.js';
import { validarProducto } from '../middleware/validate.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const Producto = await getProducto();
    const productos = await Producto.all();
    res.json(productos);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const Producto = await getProducto();
    const producto = await Producto.first({ id: Number(req.params.id) });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const errores = validarProducto(req.body);
    if (errores.length) return res.status(400).json({ errores });

    const Categoria = await getCategoria();
    const Producto = await getProducto();

    const categoria = await Categoria.first({ id: req.body.categoriaId });
    if (!categoria) return res.status(400).json({ error: 'La categoria no existe' });

    const existente = await Producto.first({ codigo: req.body.codigo });
    if (existente) return res.status(409).json({ error: 'Ya existe un producto con ese codigo' });

    const producto = await Producto.create({
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || null,
      precio: req.body.precio,
      stock: req.body.stock || 0,
      stockMinimo: req.body.stockMinimo || 5,
      estado: req.body.estado !== undefined ? req.body.estado : true,
      categoriaId: req.body.categoriaId
    });

    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const Producto = await getProducto();
    const id = Number(req.params.id);

    const existente = await Producto.first({ id });
    if (!existente) return res.status(404).json({ error: 'Producto no encontrado' });

    if (req.body.categoriaId) {
      const Categoria = await getCategoria();
      const categoria = await Categoria.first({ id: req.body.categoriaId });
      if (!categoria) return res.status(400).json({ error: 'La categoria no existe' });
    }

    if (req.body.codigo) {
      const duplicado = await Producto.first({ codigo: req.body.codigo });
      if (duplicado && duplicado.id !== id) {
        return res.status(409).json({ error: 'Ya existe otro producto con ese codigo' });
      }
    }

    const actualizado = await Producto.where({ id }).update({
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      stock: req.body.stock,
      stockMinimo: req.body.stockMinimo,
      estado: req.body.estado,
      categoriaId: req.body.categoriaId
    });

    res.json(actualizado);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const Producto = await getProducto();
    const MovimientoInventario = await getMovimientoInventario();

    const id = Number(req.params.id);
    const existente = await Producto.first({ id });
    if (!existente) return res.status(404).json({ error: 'Producto no encontrado' });

    const mov = await MovimientoInventario.first({ productoId: id });
    if (mov) {
      return res.status(400).json({ error: 'No se puede eliminar: el producto tiene movimientos asociados' });
    }

    await Producto.where({ id }).delete();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
