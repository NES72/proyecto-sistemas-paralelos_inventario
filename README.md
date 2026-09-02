# Sistema de Gestión de Inventario — SysLab 2.0

## Descripción

Proyecto académico desarrollado para implementar un entorno de desarrollo basado en una arquitectura de servicios independientes, utilizando contenedores Docker, PostgreSQL y Prisma ORM.

El sistema corresponde a una aplicación de gestión de inventario, preparada para trabajar con un backend, un frontend y una base de datos PostgreSQL ejecutados mediante Docker Compose.

## Arquitectura

El proyecto está compuesto por los siguientes servicios:

* **Backend:** Servicio desarrollado con Node.js y Express.
* **Frontend:** Aplicación frontend ejecutada como servicio independiente.
* **PostgreSQL:** Base de datos relacional para la persistencia de la información.
* **Prisma ORM:** Utilizado para definir y gestionar el esquema y las migraciones de la base de datos.
* **Agente:** Contiene las reglas y skills utilizadas para orientar el desarrollo de acuerdo con la arquitectura SysLab 2.0.

### Diagrama general

```text
                    ┌─────────────────────┐
                    │      FRONTEND       │
                    │      Puerto 5173    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       BACKEND       │
                    │      Node.js        │
                    │      Express        │
                    │      Puerto 3000    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     POSTGRESQL      │
                    │      Puerto 5432    │
                    └─────────────────────┘
```

## Tecnologías utilizadas

| Tecnología     | Uso                                |
| -------------- | ---------------------------------- |
| Node.js        | Entorno de ejecución del backend   |
| Express        | Framework del backend              |
| PostgreSQL     | Sistema gestor de base de datos    |
| Prisma ORM     | Contrato, migraciones y acceso ORM |
| Docker         | Contenedorización                  |
| Docker Compose | Orquestación de los servicios      |
| Git            | Control de versiones               |
| GitHub         | Publicación del proyecto           |

## Estructura del proyecto

```text
proyecto-sistemas-paralelos/
├── agente/
│   ├── skills/
│   │   ├── backend-syslab/
│   │   │   └── SKILL.md
│   │   └── inventario/
│   │       └── SKILL.md
│   └── rules.md
│
├── backend/
│   ├── migrations/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── prisma.config.ts
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Servicios Docker

El proyecto utiliza tres contenedores principales:

| Contenedor        | Servicio   | Puerto |
| ----------------- | ---------- | -----: |
| `lab_frontend`    | Frontend   |   5173 |
| `lab_backend`     | Backend    |   3000 |
| `lab_postgres_db` | PostgreSQL |   5432 |

## Base de datos

La base de datos PostgreSQL utiliza el nombre:

```text
syslab_db
```

El esquema de inventario contempla las siguientes entidades principales:

* **Categoria**
* **Producto**
* **MovimientoInventario**

También se utiliza el enumerado `TipoMovimiento` para representar:

* `ENTRADA`
* `SALIDA`
* `AJUSTE`

### Datos iniciales

El script de seed incorpora datos iniciales para probar el sistema:

* 3 categorías.
* 5 productos.
* 5 movimientos de inventario.

El seed fue diseñado para poder ejecutarse nuevamente sin generar registros duplicados.

## Ejecución del proyecto

### 1. Levantar los contenedores

Desde la raíz del proyecto:

```bash
docker compose up --build -d
```

### 2. Verificar los contenedores

```bash
docker compose ps
```

Los servicios principales deben aparecer en estado `Up`.

### 3. Verificar el backend

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "estado": "ok"
}
```

## Migraciones

Las migraciones se gestionan mediante el flujo de migraciones de Prisma utilizado por la versión instalada en el proyecto.

Para consultar las migraciones disponibles:

```bash
docker compose exec backend npx prisma migration list
```

Para comprobar el estado:

```bash
docker compose exec backend npx prisma migration status
```

El estado esperado es:

```text
Up to date
```

## Seed de datos

Para ejecutar el poblado inicial de la base de datos:

```bash
docker compose exec backend node prisma/seed.js
```

El proceso debe finalizar mostrando:

```text
Seed completado correctamente.
```

El seed puede ejecutarse nuevamente sin duplicar las categorías, productos ni movimientos iniciales.

## Control de versiones

El proyecto utiliza Git y Conventional Commits para registrar los principales hitos del desarrollo.

Entre los commits realizados se encuentran:

```text
feat(backend): definir esquema de prisma y script de seed inicial
chore(agente): incorporar skills de tasteskill y reglas de arquitectura syslab 2.0
feat(docker): configurar entorno multi-contenedor con docker-compose
fix(backend): adaptar seed al runtime de prisma 8
feat(db): migrar esquema a postgresql y ejecutar script de seed
```

## Estado del proyecto

Actualmente se encuentra configurado un entorno funcional de desarrollo compuesto por:

* Backend Node.js + Express.
* Frontend independiente.
* PostgreSQL.
* Prisma ORM.
* Docker Compose.
* Skills y reglas para la arquitectura SysLab 2.0.
* Migraciones versionadas.
* Seed inicial e idempotente.

## Autor

Proyecto académico — Ingeniería Informática.

## Repositorio

El código fuente del proyecto se encuentra publicado en GitHub.
