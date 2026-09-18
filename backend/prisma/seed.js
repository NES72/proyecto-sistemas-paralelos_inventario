import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTRACT_JSON_PATH = join(__dirname, 'contract.json');

await import('temporal-polyfill/full/global');

const contractJson = JSON.parse(readFileSync(CONTRACT_JSON_PATH, 'utf8'));
const { default: postgres } = await import('@prisma/orm-postgres/runtime');

const db = postgres({ contractJson, url: process.env.DATABASE_URL });
await db.connect();

const Categoria = db.orm.public.Categoria;
const Producto = db.orm.public.Producto;
const MovimientoInventario = db.orm.public.MovimientoInventario;

async function upsertCategoria(nombre, descripcion) {
  const existente = await Categoria.first({ nombre });
  if (existente) return existente;
  return Categoria.create({ nombre, descripcion, estado: true });
}

async function upsertProducto(data) {
  const existente = await Producto.first({ codigo: data.codigo });
  if (existente) return existente;
  return Producto.create(data);
}

try {
  console.log('Iniciando seed de la base de datos...');

  const electronica = await upsertCategoria('Electrónica', 'Equipos y accesorios electrónicos');
  const oficina = await upsertCategoria('Oficina', 'Productos y materiales de oficina');
  const herramientas = await upsertCategoria('Herramientas', 'Herramientas para trabajo y mantenimiento');

  const teclado = await upsertProducto({
    codigo: 'PROD-0001', nombre: 'Teclado USB', descripcion: 'Teclado USB para computadora',
    precio: 85.0, stock: 20, stockMinimo: 5, estado: true, categoriaId: electronica.id
  });
  const mouse = await upsertProducto({
    codigo: 'PROD-0002', nombre: 'Mouse USB', descripcion: 'Mouse óptico USB',
    precio: 45.0, stock: 30, stockMinimo: 10, estado: true, categoriaId: electronica.id
  });
  const cuaderno = await upsertProducto({
    codigo: 'PROD-0003', nombre: 'Cuaderno universitario', descripcion: 'Cuaderno de 100 hojas',
    precio: 18.0, stock: 50, stockMinimo: 10, estado: true, categoriaId: oficina.id
  });
  const martillo = await upsertProducto({
    codigo: 'PROD-0004', nombre: 'Martillo', descripcion: 'Martillo de acero',
    precio: 75.0, stock: 8, stockMinimo: 3, estado: true, categoriaId: herramientas.id
  });
  const destornillador = await upsertProducto({
    codigo: 'PROD-0005', nombre: 'Destornillador', descripcion: 'Destornillador de punta plana',
    precio: 35.0, stock: 12, stockMinimo: 5, estado: true, categoriaId: herramientas.id
  });

  const yaExistenMovimientos = await MovimientoInventario.first();
  if (!yaExistenMovimientos) {
    await MovimientoInventario.createAll([
      { tipo: 'ENTRADA', cantidad: 20, motivo: 'Carga inicial del inventario', productoId: teclado.id },
      { tipo: 'ENTRADA', cantidad: 30, motivo: 'Carga inicial del inventario', productoId: mouse.id },
      { tipo: 'ENTRADA', cantidad: 50, motivo: 'Carga inicial del inventario', productoId: cuaderno.id },
      { tipo: 'ENTRADA', cantidad: 8, motivo: 'Carga inicial del inventario', productoId: martillo.id },
      { tipo: 'ENTRADA', cantidad: 12, motivo: 'Carga inicial del inventario', productoId: destornillador.id }
    ]);
  }

  console.log('Seed completado correctamente.');
} finally {
  await db.close();
}
