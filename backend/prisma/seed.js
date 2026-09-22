import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { hashPassword } from '../lib/security.js';

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
const Usuario = db.orm.public.Usuario;

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
  console.log('Iniciando seed de la base de datos (ferreteria)...');

  const herramientas = await upsertCategoria('Herramientas Manuales', 'Herramientas para trabajo manual');
  const fijaciones = await upsertCategoria('Fijaciones y Tornilleria', 'Tornillos, clavos y elementos de fijacion');
  const materialElectrico = await upsertCategoria('Material Electrico', 'Insumos electricos y de iluminacion');

  const martillo = await upsertProducto({
    codigo: 'FER-0001', nombre: 'Martillo de Uña 500g', descripcion: 'Martillo de uña con mango ergonomico',
    precio: 12.5, stock: 8, stockMinimo: 3, estado: true, categoriaId: herramientas.id
  });
  const destornillador = await upsertProducto({
    codigo: 'FER-0002', nombre: 'Destornillador Plano 6mm', descripcion: 'Destornillador plano con mango antideslizante',
    precio: 5.8, stock: 15, stockMinimo: 5, estado: true, categoriaId: herramientas.id
  });
  const llave = await upsertProducto({
    codigo: 'FER-0003', nombre: 'Llave Ajustable 12"', descripcion: 'Llave ajustable de acero cromado',
    precio: 25.0, stock: 6, stockMinimo: 2, estado: true, categoriaId: herramientas.id
  });
  const tornillos = await upsertProducto({
    codigo: 'FER-0004', nombre: 'Tornillos 1/4" x 1" (bolsa x100)', descripcion: 'Bolsa con 100 tornillos de acero',
    precio: 3.9, stock: 40, stockMinimo: 10, estado: true, categoriaId: fijaciones.id
  });
  const cinta = await upsertProducto({
    codigo: 'FER-0005', nombre: 'Cinta Aislante Negra', descripcion: 'Rollo de cinta aislante para instalaciones electricas',
    precio: 2.5, stock: 25, stockMinimo: 8, estado: true, categoriaId: materialElectrico.id
  });

  const yaExistenMovimientos = await MovimientoInventario.first();
  if (!yaExistenMovimientos) {
    await MovimientoInventario.createAll([
      { tipo: 'ENTRADA', cantidad: 8, motivo: 'Carga inicial del inventario', productoId: martillo.id },
      { tipo: 'ENTRADA', cantidad: 15, motivo: 'Carga inicial del inventario', productoId: destornillador.id },
      { tipo: 'ENTRADA', cantidad: 6, motivo: 'Carga inicial del inventario', productoId: llave.id },
      { tipo: 'ENTRADA', cantidad: 40, motivo: 'Carga inicial del inventario', productoId: tornillos.id },
      { tipo: 'ENTRADA', cantidad: 25, motivo: 'Carga inicial del inventario', productoId: cinta.id }
    ]);
  }

  const usuarioAdmin = await Usuario.first({ usuario: 'admin' });
  if (!usuarioAdmin) {
    await Usuario.create({
      nombre: 'Administrador FerroStock',
      usuario: 'admin',
      password: await hashPassword('admin2026'),
      rol: 'ADMINISTRADOR',
      estado: true
    });
    console.log('Usuario admin creado (admin / admin2026).');
  }

  console.log('Seed completado correctamente.');
} finally {
  await db.close();
}