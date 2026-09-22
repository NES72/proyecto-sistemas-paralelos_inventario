#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/c9bc2918de418ffc58c185901399051909dc4416a8fccad8161502fe3fb50488/contract';
import startContract from '../../snapshots/c9bc2918de418ffc58c185901399051909dc4416a8fccad8161502fe3fb50488/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d3d4d13279b15fe1dbee356851793e7c0224c82b7e378714c07ffbcae0f1949d/contract';
import endContract from '../../snapshots/d3d4d13279b15fe1dbee356851793e7c0224c82b7e378714c07ffbcae0f1949d/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'sesion',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('revocado', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('usuarioId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'usuario',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('estado', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('rol', 'text', {
            notNull: true,
            default: lit('OPERADOR'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('usuario', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('usuario_rol_check_68c23eff', "\"rol\" IN ('ADMINISTRADOR', 'OPERADOR')"),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'sesion',
        constraint: 'sesion_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'usuario',
        constraint: 'usuario_usuario_key',
        columns: ['usuario'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sesion',
        index: 'sesion_usuarioId_idx_5f01c7d6',
        columns: ['usuarioId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'sesion',
        foreignKey: {
          name: 'sesion_usuarioId_fkey',
          columns: ['usuarioId'],
          references: { schema: 'public', table: 'usuario', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
