import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTRACT_JSON_PATH = join(__dirname, '..', 'prisma', 'contract.json');

let db = null;

export async function getDb() {
  if (db) return db;

  await import('temporal-polyfill/full/global');

  const contractJson = JSON.parse(readFileSync(CONTRACT_JSON_PATH, 'utf8'));
  const { default: postgres } = await import('@prisma/orm-postgres/runtime');

  db = postgres({ contractJson, url: process.env.DATABASE_URL });
  await db.connect();

  return db;
}

export async function getCategoria() {
  const db = await getDb();
  return db.orm.public.Categoria;
}

export async function getProducto() {
  const db = await getDb();
  return db.orm.public.Producto;
}

export async function getMovimientoInventario() {
  const db = await getDb();
  return db.orm.public.MovimientoInventario;
}
