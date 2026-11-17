# LIMS Lab — Backend NestJS + Prisma + PostgreSQL

Backend de los **TP 9, TP 10 y TP 11** (UTN-FRT): API REST con NestJS, validación de DTOs y
persistencia en PostgreSQL a través de Prisma 7.

Replica las tablas del sistema LIMS que intervienen en el flujo
**paciente → orden → análisis**, tomadas de `axel674/LIMS-laboratorio-db`.

## Stack

| Pieza | Versión |
|---|---|
| NestJS | 12 |
| Prisma | 7 (`prisma-client` + `@prisma/adapter-pg`) |
| PostgreSQL | 17 |
| Validación | `class-validator` + `class-transformer` (`ValidationPipe` global) |
| Puerto | `4000` (`PORT` en `.env`) |

## Puesta en marcha

```bash
npm install                 # instala y genera el cliente de Prisma (postinstall)
cp .env.example .env        # completar DATABASE_URL y credenciales
npx prisma migrate dev --name init
npm run prisma:seed         # carga catálogos + datos de ejemplo
npm run start:dev           # http://localhost:4000/api
```

`.env`:

```
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/lims_lab?schema=public"
PORT=4000
API_BASE_URL="http://localhost:4000/api"
```

## Estructura

```
src/
  main.ts                      # ValidationPipe global + puerto 4000
  modules/
    app/                       # módulo raíz (app.module.ts, controller y service)
    prisma/                    # PrismaService + PrismaModule (global)
    pacientes/                 # controller, service, dto/
    analisis/
    ordenes/
    tipos-muestra/
    obras-sociales/
prisma/
  schema.prisma                # 6 tablas con PK, FK y restricciones
  seed.ts                      # catálogos reales + datos de ejemplo
```

Cada módulo tiene su `Create<Entidad>Dto` y `Update<Entidad>Dto`; el controller sólo recibe
el body/param validado y delega en el service, que es el único que habla con Prisma.

## Endpoints

Todos cuelgan de `/api`. Cada recurso tiene listar, obtener, crear, actualizar y eliminar.

| Recurso | Ruta |
|---|---|
| Info del servicio | `GET /api` |
| Pacientes | `/api/pacientes` |
| Análisis | `/api/analisis` |
| Órdenes | `/api/ordenes` |
| Tipos de muestra | `/api/tipos-muestra` |
| Obras sociales | `/api/obras-sociales` |

`GET /api/ordenes` acepta `?estado=abierta&pacienteId=<uuid>`.

### Ejemplo: crear una orden

```bash
POST /api/ordenes
{
  "pacienteId": "3f3c0d4e-...",
  "analisisIds": [1, 5, 7],
  "observaciones": "Perfil renal"
}
```

El número de orden se genera solo (`ORD-2026-000007`). Si el paciente tiene obra social,
los ítems quedan cubiertos; si no, particulares.

## Modelo de datos

| Tabla | Claves |
|---|---|
| `pacientes` | PK `id` (uuid), `dni` único, FK `obra_social_id` |
| `obras_sociales` | PK `id`, `nombre` único |
| `tipos_muestra` | PK `id`, `nombre` único |
| `analisis` | PK `id`, `codigo` único, FK `tipo_muestra_id` |
| `ordenes` | PK `id` (uuid), `nro_orden` único, FK `paciente_id`, FK `obra_social_id` |
| `orden_analisis` | PK `id` (uuid), FK `orden_id` (cascade), FK `analisis_id`, único (`orden_id`, `analisis_id`) |

Enums: `sexo` (`F`, `M`, `X`) y `estado_orden` (`abierta`, `en_proceso`, `completa`,
`informada`, `anulada`).

## Origen de los datos del seed

- **Catálogos reales** del LIMS (tipos de muestra, obras sociales y los 13 análisis con
  unidad, rango y días de demora): migraciones `20261021_01_catalogo_analisis.sql` y
  `20261022_01_fila_atencion.sql` de `axel674/LIMS-laboratorio-db`.
- **Pacientes y órdenes de ejemplo**: el LIMS no versiona sus filas de pacientes, así que el
  seed las arma con ese catálogo (5 pacientes, 6 órdenes, 12 ítems). El seed reinicia esas
  dos tablas cada vez que se corre; los catálogos se actualizan sin duplicar.

## Fuera de alcance

- `auth` y `perfiles`/`personal`: corresponden al TP 12.
- RLS, muestras, resultados, informes y cobros: son del proyecto LIMS React + Supabase.
