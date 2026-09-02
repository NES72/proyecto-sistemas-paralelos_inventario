# Reglas del Agente - Sistema de Gestión de Inventario

## 1. Propósito

Estas reglas definen el comportamiento que debe seguir el agente de IA durante el desarrollo del Sistema de Gestión de Inventario.

El proyecto utiliza una arquitectura basada en SysLab 2.0 y está compuesto por:

- Frontend
- Backend
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose

## 2. Arquitectura

La comunicación debe seguir el siguiente flujo:

Frontend
    |
    | HTTP / REST
    v
Backend
    |
    | Prisma ORM
    v
PostgreSQL

El frontend no debe comunicarse directamente con PostgreSQL.

## 3. Backend

El backend será responsable de:

- Procesar las solicitudes del frontend.
- Validar los datos recibidos.
- Ejecutar la lógica de negocio.
- Gestionar las operaciones de inventario.
- Acceder a PostgreSQL mediante Prisma.
- Generar respuestas apropiadas para la API.

## 4. Persistencia

PostgreSQL será la base de datos principal.

Prisma ORM será el mecanismo de acceso a los datos.

El esquema de datos estará definido en:

`backend/prisma/schema.prisma`

Los cambios estructurales deberán realizarse mediante migraciones de Prisma.

## 5. Variables de entorno

Las credenciales de base de datos y configuraciones sensibles deben utilizar variables de entorno.

No se deben almacenar credenciales reales en Git.

El archivo `.env` no debe ser versionado.

Cuando sea necesario documentar variables de entorno se debe utilizar `.env.example`.

## 6. Integridad del inventario

Todo cambio de stock debe estar asociado con un movimiento de inventario.

Los movimientos permitidos son:

- ENTRADA
- SALIDA
- AJUSTE

No se debe permitir stock negativo.

Las salidas no pueden superar el stock disponible.

Los ajustes deben registrar un motivo.

## 7. Validaciones

El backend debe validar:

- Datos obligatorios.
- Tipos de datos.
- Valores numéricos.
- Stock disponible.
- Existencia de categorías.
- Existencia de productos.
- Códigos de producto únicos.

Las validaciones deben realizarse antes de modificar la base de datos.

## 8. Seguridad

El agente no debe:

- Exponer contraseñas.
- Introducir credenciales directamente en el código.
- Modificar archivos `.env` con información sensible para subirlos a Git.
- Permitir acceso directo del frontend a PostgreSQL.

## 9. Docker

El backend y PostgreSQL deben ejecutarse mediante Docker Compose.

Los servicios deben comunicarse utilizando la red interna definida por Docker Compose.

El backend debe utilizar el nombre del servicio de PostgreSQL para conectarse a la base de datos dentro del entorno Docker.

## 10. Calidad del código

El código generado debe:

- Ser modular.
- Ser legible.
- Evitar duplicación.
- Utilizar nombres descriptivos.
- Manejar errores.
- Mantener separación de responsabilidades.

## 11. Cambios en el proyecto

Antes de modificar una parte importante del sistema, el agente debe considerar:

1. La arquitectura existente.
2. El esquema de Prisma.
3. Las relaciones entre entidades.
4. Las reglas de inventario.
5. La compatibilidad con Docker.

No se deben realizar cambios que contradigan estas reglas sin una justificación explícita.

## 12. Git

Los cambios significativos deben registrarse utilizando Conventional Commits.

Ejemplos:

- `feat(backend): agregar endpoint de productos`
- `fix(inventario): corregir actualización de stock`
- `docs(agente): actualizar reglas del sistema`
- `chore(docker): actualizar configuración`

## 13. Principio general

El agente debe priorizar:

1. Integridad de los datos.
2. Seguridad.
3. Separación de responsabilidades.
4. Consistencia del inventario.
5. Compatibilidad con la arquitectura SysLab 2.0.
6. Código mantenible.
