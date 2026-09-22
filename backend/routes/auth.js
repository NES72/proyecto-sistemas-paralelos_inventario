import { Router } from 'express';
import { getUsuario, getSesion } from '../lib/db.js';
import { hashPassword, verifyPassword, generarToken, sha256hex } from '../lib/security.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validarLogin, validarUsuario, validarCambioPassword } from '../middleware/validate.js';

await import('temporal-polyfill/full/global');

const router = Router();
const DURACION_SESION_HORAS = 24;

function publicoUsuario(user) {
  return { id: user.id, nombre: user.nombre, usuario: user.usuario, rol: user.rol, estado: user.estado };
}

router.post('/login', async (req, res, next) => {
  try {
    const errores = validarLogin(req.body);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    const Usuario = await getUsuario();
    const user = await Usuario.first({ usuario: req.body.usuario.trim() });

    if (!user || !(await verifyPassword(req.body.password, user.password))) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    if (!user.estado) {
      return res.status(403).json({ error: 'Usuario desactivado' });
    }

    const token = generarToken();
    const Sesion = await getSesion();
    await Sesion.create({
      tokenHash: sha256hex(token),
      usuarioId: user.id,
      expiresAt: Temporal.Now.instant().add({ hours: DURACION_SESION_HORAS })
    });

    res.json({ token, usuario: publicoUsuario(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    const Sesion = await getSesion();
    await Sesion.where({ id: req.sesion.id }).update({ revocado: true });
    res.json({ mensaje: 'Sesion cerrada' });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ usuario: req.usuario });
});

router.post('/cambiar-password', requireAuth, async (req, res, next) => {
  try {
    const errores = validarCambioPassword(req.body);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    const Usuario = await getUsuario();
    const user = await Usuario.first({ id: req.usuario.id });
    if (!user || !(await verifyPassword(req.body.passwordActual, user.password))) {
      return res.status(401).json({ error: 'La contrasena actual no es correcta' });
    }

    await Usuario.where({ id: user.id }).update({
      password: await hashPassword(req.body.nuevaPassword)
    });

    res.json({ mensaje: 'Contrasena actualizada' });
  } catch (err) {
    next(err);
  }
});

router.get('/usuarios', requireAdmin, async (req, res, next) => {
  try {
    const Usuario = await getUsuario();
    const usuarios = await Usuario.all();
    res.json(usuarios.map(publicoUsuario));
  } catch (err) {
    next(err);
  }
});

router.post('/usuarios', requireAdmin, async (req, res, next) => {
  try {
    const errores = validarUsuario(req.body);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    const Usuario = await getUsuario();
    const existente = await Usuario.first({ usuario: req.body.usuario.trim() });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese nombre de usuario' });
    }

    const user = await Usuario.create({
      nombre: req.body.nombre.trim(),
      usuario: req.body.usuario.trim(),
      password: await hashPassword(req.body.password),
      rol: req.body.rol || 'OPERADOR',
      estado: req.body.estado === undefined ? true : req.body.estado
    });

    res.status(201).json(publicoUsuario(user));
  } catch (err) {
    next(err);
  }
});

export default router;