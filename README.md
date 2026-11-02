# LIMS-Lab · API del sistema de gestión del laboratorio

Backend del TFI de la Tecnicatura Universitaria en Programación (UTN-FRT). API REST hecha con [NestJS](https://nestjs.com) que atiende las peticiones del frontend del LIMS (Laboratory Information Management System).

> Estado: estructura inicial (TP 9). Los módulos tienen su CRUD generado pero todavía sin lógica de negocio ni conexión a la base de datos.

## Requisitos

- Node.js 20 o superior
- npm
- PostgreSQL (el esquema está en el repositorio [LIMS-laboratorio-db](https://github.com/axel674/LIMS-laboratorio-db))

## Instalación

```bash
npm install
cp .env.example .env
npm run start:dev
```

La API queda disponible en `http://localhost:4000/`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto en el que escucha la API | `4000` |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://usuario:password@localhost:5432/nombre_db` |
| `API_BASE_URL` | URL base de la API | `http://localhost:4000/` |

El archivo `.env` no se versiona; usar `.env.example` como plantilla.

## Estructura

```
src/
├── main.ts
└── modules/
    ├── app/
    ├── auth/
    ├── pacientes/
    ├── personal/
    ├── sucursales/
    ├── obras-sociales/
    ├── medicos/
    ├── turnos/
    ├── ordenes/
    ├── analisis/
    ├── muestras/
    ├── resultados/
    ├── informes/
    └── notificaciones/
```

Cada módulo (salvo `app`) tiene `controller`, `service`, `module`, `dto/` y `entities/`, y corresponde a una entidad del esquema de la base de datos.

## Endpoints

Cada recurso expone el CRUD estándar bajo su propio prefijo. Ejemplo con `pacientes`:

| Método | Ruta | Acción |
|---|---|---|
| `POST` | `/pacientes` | Crear |
| `GET` | `/pacientes` | Listar |
| `GET` | `/pacientes/:id` | Obtener uno |
| `PATCH` | `/pacientes/:id` | Actualizar |
| `DELETE` | `/pacientes/:id` | Eliminar |

La colección de Postman con todos los endpoints está en [`docs/postman/LIMS-Lab.postman_collection.json`](docs/postman/LIMS-Lab.postman_collection.json). Para usarla: *Import* en Postman y, si hace falta, cambiar la variable `baseUrl`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Levanta la API en modo desarrollo con recarga |
| `npm run build` | Compila el proyecto |
| `npm run start:prod` | Ejecuta la versión compilada |

## Flujo de trabajo con Git

- `main`: rama estable.
- `dev`: rama de integración.
- `feature/<nombre>`, `fix/<nombre>`, `refactor/<nombre>`, `docs/<nombre>`: ramas de trabajo que salen de `dev` y vuelven a `dev` mediante Pull Request.
