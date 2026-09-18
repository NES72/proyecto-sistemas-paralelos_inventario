import { Router } from 'express';
import { getCategoria, getProducto } from '../lib/db.js';
import { validarCategoria } from '../middleware/validate.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const Categoria = await getCategoria();
    const categorias = await Categoria.all();
    res.json(categorias);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const Categoria = await getCategoria();
    const categoria = await Categoria.first({ id: Number(req.params.id) });
    if (!categoria) return res.status(404).json({ error: 'Categoria no encontrada' });
    res.json(categoria);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const errores = validarCategoria(req.body);
    if (errores.length) return res.status(400).json({ errores });

    const Categoria = await getCategoria();
    const existente = await Categoria.first({ nombre: req.body.nombre });
    if (existente) return res.status(409).json({ error: 'Ya existe una categoria con ese nombre' });

    const categoria = await Categoria.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || null,
      estado: req.body.estado !== undefined ? req.body.estado : true
    });

    res.status(201).json(categoria);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const Categoria = await getCategoria();
    const id = Number(req.params.id);

    const existente = await Categoria.first({ id });
    if (!existente) return res.status(404).json({ error: 'Categoria no encontrada' });

    const errores = validarCategoria(req.body);
    if (errores.length) return res.status(400).json({ errores });

    if (req.body.nombre) {
      const duplicada = await Categoria.first({ nombre: req.body.nombre });
      if (duplicada && duplicada.id !== id) {
        return res.status(409).json({ error: 'Ya existe otra categoria con ese nombre' });
      }
    }

    const actualizado = await Categoria.where({ id }).update({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      estado: req.body.estado
    });

    res.json(actualizado);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const Categoria = await getCategoria();
    const Producto = await getProducto();

    const id = Number(req.params.id);
    const existente = await Categoria.first({ id });
    if (!existente) return res.status(404).json({ error: 'Categoria no encontrada' });

    const prod = await Producto.first({ categoriaId: id });
    if (prod) {
      return res.status(400).json({ error: 'No se puede eliminar: la categoria tiene productos asociados' });
    }

    await Categoria.where({ id }).delete();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
