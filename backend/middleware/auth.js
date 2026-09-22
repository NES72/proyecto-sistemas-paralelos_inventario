import { getUsuario, getSesion } from '../lib/db.js';
import { sha256hex, sesionExpirada } from '../lib/security.js';

await import('temporal-polyfill/full/global');

function publicoUsuario(user) {
  return { id: user.id, nombre: user.nombre, usuario: user.usuario, rol: user.rol, estado: user.estado };
}

function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

export async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const Sesion = await getSesion();
    const sesion = await Sesion.first({ tokenHash: sha256hex(token), revocado: false });
    if (!sesion || sesionExpirada(sesion.expiresAt, Temporal.Now.instant())) {
      return res.status(401).json({ error: 'Sesion invalida o expirada' });
    }

    const Usuario = await getUsuario();
    const user = await Usuario.first({ id: sesion.usuarioId });
    if (!user || !user.estado) {
      return res.status(401).json({ error: 'Usuario no valido' });
    }

    req.sesion = sesion;
    req.usuario = publicoUsuario(user);
    next();
  } catch (err) {
    next(err);
  }
}

export const requireAdmin = [
  requireAuth,
  (req, res, next) => {
    if (req.usuario.rol !== 'ADMINISTRADOR') {
      return res.status(403).json({ error: 'Requiere permisos de administrador' });
    }
    next();
  }
];