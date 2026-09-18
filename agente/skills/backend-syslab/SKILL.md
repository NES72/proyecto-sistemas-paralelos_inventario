# Backend SysLab 2.0

## Objetivo

Definir las instrucciones para desarrollar y mantener el backend del Sistema de Gestión de Inventario siguiendo una arquitectura basada en SysLab 2.0.

## Tecnologías

- Node.js
- API REST
- Prisma ORM
- PostgreSQL
- Docker
- Docker Compose

## Reglas

1. El backend debe exponer una API REST para la comunicación con el frontend.

2. Toda operación de persistencia debe realizarse mediante Prisma ORM.

3. PostgreSQL será utilizado como sistema gestor de base de datos.

4. Las credenciales y configuraciones sensibles deben utilizar variables de entorno.

5. Nunca se deben incluir contraseñas o credenciales directamente en el código fuente.

6. Las responsabilidades deben mantenerse separadas entre rutas, lógica de negocio y acceso a datos.

7. Las operaciones relacionadas con la base de datos deben utilizar el cliente de Prisma.

8. Los errores deben manejarse de forma controlada y proporcionar respuestas apropiadas a la API.

9. Las validaciones de datos deben realizarse antes de ejecutar operaciones de persistencia.

10. El backend debe poder ejecutarse dentro del contenedor Docker definido para el proyecto.

## Persistencia

Prisma será el intermediario entre el backend y PostgreSQL.

Las modificaciones al modelo de datos deben realizarse mediante el archivo:

`backend/prisma/contract.prisma`

Los cambios estructurales de la base de datos deben gestionarse mediante migraciones de Prisma.

## Arquitectura

Frontend
    |
    | HTTP / REST API
    v
Backend
    |
    | Prisma ORM
    v
PostgreSQL

## Buenas prácticas

- Mantener el código modular.
- Evitar lógica duplicada.
- Utilizar nombres descriptivos.
- Validar entradas provenientes del cliente.
- No exponer información sensible.
- Registrar errores importantes.
- Mantener compatibilidad con Docker Compose.
