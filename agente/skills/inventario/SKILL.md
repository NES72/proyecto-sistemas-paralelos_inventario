# Gestión de Inventario

## Objetivo

Definir las reglas de negocio para el Sistema de Gestión de Inventario.

## Entidades principales

El sistema utiliza las siguientes entidades:

- Categoria
- Producto
- MovimientoInventario

## Categorías

Cada producto debe pertenecer a una categoría existente.

Una categoría puede tener múltiples productos.

Las categorías deben tener:

- nombre
- descripción
- estado

El nombre de la categoría debe ser único.

## Productos

Cada producto debe tener:

- código único
- nombre
- descripción
- precio
- stock
- stock mínimo
- estado
- categoría

El código del producto debe ser único.

El stock no debe tener valores negativos.

## Movimientos de inventario

Todo cambio de stock debe quedar registrado mediante un movimiento de inventario.

Los movimientos pueden ser:

- ENTRADA
- SALIDA
- AJUSTE

Cada movimiento debe registrar:

- tipo
- cantidad
- motivo
- producto
- fecha

## Reglas de stock

### Entrada

Una entrada incrementa el stock del producto.

### Salida

Una salida disminuye el stock del producto.

No se debe permitir una salida superior al stock disponible.

### Ajuste

Un ajuste permite corregir el stock cuando exista una diferencia entre el stock registrado y el stock físico.

El ajuste debe registrar un motivo.

## Integridad

No se debe modificar el stock sin considerar el movimiento correspondiente.

Las operaciones de actualización del stock deben mantener la consistencia entre el inventario y sus movimientos.

## Stock mínimo

Cuando el stock de un producto sea igual o inferior al stock mínimo, el sistema debe considerarlo como producto con stock bajo.

## Persistencia

Los datos deben almacenarse en PostgreSQL utilizando Prisma ORM.

No se deben utilizar consultas directas a PostgreSQL desde el frontend.

## Seguridad

No se deben almacenar datos sensibles innecesarios dentro de los registros de inventario.

Las operaciones que modifiquen inventario deben ser validadas por el backend.
