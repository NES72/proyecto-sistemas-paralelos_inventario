# FerroStock — Sistema de Gestión de Inventario

## Descripción

Proyecto académico desarrollado para implementar un entorno de desarrollo basado en una arquitectura de servicios independientes, utilizando contenedores Docker, PostgreSQL y Prisma ORM.

El proyecto corresponde a una aplicación de gestión de inventario para una ferretería, preparada para trabajar con un backend, un frontend y una base de datos PostgreSQL ejecutados mediante Docker Compose.

## Arquitectura

El proyecto está compuesto por los siguientes servicios:

* **Backend:** Servicio desarrollado con Node.js y Express.
* **Frontend:** Aplicación frontend ejecutada como servicio independiente.
* **PostgreSQL:** Base de datos relacional para la persistencia de la información.
* **Prisma ORM:** Utilizado para definir y gestionar el esquema y las migraciones de la base de datos.
* **Agente:** Contiene las reglas y skills utilizadas para orientar el desarrollo de acuerdo con la arquitectura por capas del proyecto.

### Diagrama general

```text
                    ┌─────────────────────┐
                    │      FRONTEND       │
                    │  React + Vite       │
                    │      Puerto 5173    │
                    └──────────┬──────────┘
                               │  proxy /api
                               ▼
                    ┌─────────────────────┐
                    │       BACKEND       │
                    │      Node.js        │
                    │      Express        │
                    │      Puerto 3000    │
                    └──────────┬──────────┘
                               │ Prisma ORM
                               ▼
                    ┌─────────────────────┐
                    │     POSTGRESQL      │
                    │      Puerto 5432    │
                    └─────────────────────┘
```

## Tecnologías utilizadas

| Tecnología       | Uso                                          |
| ---------------- | -------------------------------------------- |
| Node.js          | Entorno de ejecución del backend (ESM)      |
| Express 5        | Framework de la API REST del backend        |
| Prisma 8 ORM     | Contrato, migraciones y acceso ORM          |
| PostgreSQL 15    | Sistema gestor de base de datos             |
| React 19         | Biblioteca de interfaz del frontend          |
| Vite 8           | Servidor de desarrollo y empaquetado        |
| React Router 7   | Navegación de la SPA                         |
| Docker           | Contenedorización                            |
| Docker Compose   | Orquestación de los servicios                |
| Git / GitHub     | Control de versiones y publicación           |

## Estructura del proyecto

```text
proyecto-sistemas-paralelos/
├── agente/
│   ├── rules.md                        Reglas de arquitectura del proyecto
│   └── skills/
│       ├── backend/SKILL.md
│       └── inventario/SKILL.md
│
├── backend/
│   ├── lib/db.js                       Único punto de acceso a Prisma 8 (ORM)
│   ├── middleware/                     Validación, autenticación y manejo de errores
│   │   ├── auth.js                     requireAuth / requireAdmin (sesiones por token)
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── routes/                         Endpoints REST
│   │   ├── auth.js                     Login, logout, me y gestión de usuarios
│   │   ├── categorias.js
│   │   ├── productos.js
│   │   └── movimientos.js
│   ├── services/
│   │   └── inventarioService.js        Lógica de negocio (reglas de stock)
│   ├── lib/
│   │   ├── db.js                       Único punto de acceso a Prisma 8 (ORM)
│   │   └── security.js                 Hash de contraseñas (scrypt) y tokens
│   ├── prisma/
│   │   ├── contract.prisma             Esquema (fuente de verdad de la BD)
│   │   ├── contract.json               Contrato emitido (usa el runtime)
│   │   ├── contract.d.ts
│   │   └── seed.js                     Datos iniciales idempotentes
│   ├── migrations/                     Migraciones y snapshots versionados
│   ├── prisma.config.ts                Configuración del CLI de Prisma
│   ├── server.js                       Punto de entrada (Express)
│   ├── docker-entrypoint.sh            Espera BD + migra + seed + arranca
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js                  Proxy /api → http://backend:3000
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── main.jsx                    Montaje de React
│       ├── App.jsx                     Router + navegación + rutas protegidas
│       ├── index.css
│       ├── pages/                      Login, Usuarios, Categorias, Productos, Movimientos
│       └── services/
│           ├── api.js                  Cliente HTTP del backend (adjunta token)
│           └── auth.js                 Sesión en localStorage (token + usuario)
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

## API REST

El backend expone los siguientes endpoints bajo `http://localhost:3000/api` (el frontend accede a través del proxy `/api` en `localhost:5173`).

Todas las rutas de gestión (`/categorias`, `/productos`, `/movimientos` y `/auth/usuarios`) requieren el encabezado `Authorization: Bearer <token>`, obtenido previamente en el login.

### Autenticación

| Método | Ruta                  | Descripción                                    | Acceso    |
| ------ | --------------------- | ---------------------------------------------- | --------- |
| POST   | `/api/auth/login`       | Inicia sesión y devuelve `token` + `usuario`  | Público   |
| POST   | `/api/auth/logout`      | Cierra la sesión activa                       | Autenticado |
| GET    | `/api/auth/me`          | Devuelve el usuario de la sesión activa       | Autenticado |
| GET    | `/api/auth/usuarios`    | Lista los usuarios del sistema                | Admin     |
| POST   | `/api/auth/usuarios`    | Crea un usuario (`nombre`, `usuario`, `password`, `rol`) | Admin |
| POST   | `/api/auth/cambiar-password` | Cambia la propia contraseña (`passwordActual`, `nuevaPassword`) | Autenticado |

El usuario por defecto creado por el seed es:

```text
usuario: admin
password: admin2026
```

### Categorías

| Método | Ruta                  | Descripción                              |
| ------ | --------------------- | ---------------------------------------- |
| GET    | `/api/categorias`       | Lista todas las categorías               |
| POST   | `/api/categorias`       | Crea una categoría                       |
| GET    | `/api/categorias/:id`   | Obtiene una categoría por id             |
| PUT    | `/api/categorias/:id`   | Actualiza una categoría                  |
| DELETE | `/api/categorias/:id`   | Elimina una categoría (bloqueada si tiene productos) |

### Productos

| Método | Ruta                 | Descripción                              |
| ------ | -------------------- | ---------------------------------------- |
| GET    | `/api/productos`       | Lista todos los productos                |
| POST   | `/api/productos`       | Crea un producto (require `categoriaId`) |
| GET    | `/api/productos/:id`   | Obtiene un producto por id               |
| PUT    | `/api/productos/:id`   | Actualiza un producto                    |
| DELETE | `/api/productos/:id`   | Elimina un producto (bloqueada si tiene movimientos) |

### Movimientos de inventario

| Método | Ruta                    | Descripción                                             |
| ------ | ----------------------- | ------------------------------------------------------- |
| GET    | `/api/movimientos`        | Lista todos los movimientos (opcional `?productoId=` para filtrar por producto) |
| GET    | `/api/movimientos/:id`    | Obtiene un movimiento por id                            |
| POST   | `/api/movimientos`        | Registra un movimiento (`ENTRADA`, `SALIDA` o `AJUSTE`) |

### Reglas de negocio aplicadas

- `ENTRADA`: incrementa el stock del producto.
- `SALIDA`: rechazada si la cantidad supera el stock disponible (`Stock insuficiente`).
- `AJUSTE`: requiere `motivo` y fija el stock al valor indicado.
- Nunca se permite stock negativo.
- Acceso restringido por sesión (token). Solo los administradores pueden eliminar categorías/productos y gestionar usuarios.

## Base de datos

La base de datos PostgreSQL utiliza el nombre:

```text
inventario_db
```

El esquema de inventario contempla las siguientes entidades principales:

* **Categoria**
* **Producto**
* **MovimientoInventario**
* **Usuario**
* **Sesion**

También se utilizan los enumerados:

* `TipoMovimiento`: `ENTRADA`, `SALIDA`, `AJUSTE`.
* `Rol`: `ADMINISTRADOR`, `OPERADOR`.

Las contraseñas se guardan únicamente como hash (scrypt) y las sesiones por token se almacenan en la tabla `Sesion` con expiración (24 h).

### Datos iniciales

El script de seed incorpora datos de ejemplo orientados a una ferretería:

* 3 categorías: Herramientas Manuales, Fijaciones y Tornilleria, Material Electrico.
* 5 productos: Martillo de Uña, Destornillador Plano, Llave Ajustable, Tornillos, Cinta Aislante.
* 5 movimientos de inventario (ENTRADA de carga inicial).
* 1 usuario administrador (`admin` / `admin2026`).

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
chore(agente): incorporar skills y reglas de arquitectura del proyecto
feat(docker): configurar entorno multi-contenedor con docker-compose
fix(backend): adaptar seed al runtime de prisma 8
feat(db): migrar esquema a postgresql y ejecutar script de seed
```

## Estado del proyecto

Actualmente se encuentra configurado un entorno funcional de desarrollo compuesto por:

* Backend Node.js + Express (API REST completa, ESM).
* Autenticación por sesión: login/logout, rutas protegidas y roles Admin/Operador.
* Frontend React + Vite funcional (listado/CRUD de categorías, productos y movimientos; páginas de login, usuarios y cambio de contraseña).
* Búsqueda y filtros de productos por código/nombre y categoría, etiquetas de "Sin stock"/"Stock bajo" con filtro "Solo stock bajo", ficha de producto con historial de movimientos y valor, y valor total del inventario (precio × stock).
* Código sugerido (FER-####) al registrar productos; el stock inicial declarado se registra automáticamente como movimiento ENTRADA.
* Activación/desactivación de productos (solo administrador).
* PostgreSQL.
* Prisma ORM con contrato y migraciones versionadas.
* Docker Compose.
* Skills y reglas de arquitectura por capas.
* Migraciones versionadas.
* Seed inicial e idempotente.

## Autor

Proyecto académico — Ingeniería Informática.

## Repositorio

El código fuente del proyecto se encuentra publicado en GitHub.
