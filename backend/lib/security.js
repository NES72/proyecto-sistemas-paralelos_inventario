import { scrypt, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const KEY_LEN = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, KEY_LEN);
  return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, 'hex');
  const testBuffer = await scryptAsync(password, salt, KEY_LEN);
  return hashBuffer.length === testBuffer.length && timingSafeEqual(hashBuffer, testBuffer);
}

export function sha256hex(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function generarToken() {
  return randomBytes(32).toString('base64url');
}

export function sesionExpirada(expiresAt, now) {
  return Temporal.Instant.compare(expiresAt, now) < 0;
}