#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/c9bc2918de418ffc58c185901399051909dc4416a8fccad8161502fe3fb50488/contract';
import endContract from '../../snapshots/c9bc2918de418ffc58c185901399051909dc4416a8fccad8161502fe3fb50488/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'categoria',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('descripcion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('estado', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'movimientoInventario',
        columns: [
          col('cantidad', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('motivo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('productoId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tipo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'movimientoInventario_tipo_check_3401cc7a',
            "\"tipo\" IN ('ENTRADA', 'SALIDA', 'AJUSTE')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'producto',
        columns: [
          col('categoriaId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('codigo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('descripcion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('estado', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('precio', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
          col('stock', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('stockMinimo', 'int4', {
            notNull: true,
            default: lit(5),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'categoria',
        constraint: 'categoria_nombre_key',
        columns: ['nombre'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'producto',
        constraint: 'producto_codigo_key',
        columns: ['codigo'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'movimientoInventario',
        index: 'movimientoInventario_productoId_idx_cc0c10f0',
        columns: ['productoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'producto',
        index: 'producto_categoriaId_idx_63b46427',
        columns: ['categoriaId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'movimientoInventario',
        foreignKey: {
          name: 'movimientoInventario_productoId_fkey',
          columns: ['productoId'],
          references: { schema: 'public', table: 'producto', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'producto',
        foreignKey: {
          name: 'producto_categoriaId_fkey',
          columns: ['categoriaId'],
          references: { schema: 'public', table: 'categoria', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
