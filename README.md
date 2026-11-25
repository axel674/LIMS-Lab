# LIMS Lab — Backend NestJS + Prisma + PostgreSQL

Backend de los **TP 9, TP 10, TP 11 y TP 12** (UTN-FRT): API REST con NestJS, validación de DTOs,
persistencia en PostgreSQL a través de Prisma 7 y registro e inicio de sesión con JWT.

Replica las tablas del sistema LIMS que intervienen en el flujo
**paciente → orden → análisis**, tomadas de `axel674/LIMS-laboratorio-db`.

## Stack

| Pieza | Versión |
|---|---|
| NestJS | 12 |
| Prisma | 7 (`prisma-client` + `@prisma/adapter-pg`) |
| PostgreSQL | 17 |
| Validación | `class-validator` + `class-transformer` (`ValidationPipe` global) |
| Autenticación | `@nestjs/jwt` + `bcrypt` (TP 12) |
| Puerto | `4000` (`PORT` en `.env`) |

## Puesta en marcha

```bash
npm install                 # instala y genera el cliente de Prisma (postinstall)
cp .env.example .env        # completar DATABASE_URL y credenciales
npx prisma migrate dev      # aplica las migraciones (init y auth)
npm run prisma:seed         # carga catálogos + datos de ejemplo
npm run start:dev           # http://localhost:4000/api
```

`.env`:

```
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/lims_lab?schema=public"
PORT=4000
API_BASE_URL="http://localhost:4000/api"
JWT_SECRET="una-cadena-larga-y-aleatoria"
JWT_EXPIRES_IN="1h"
```

`JWT_SECRET` firma los tokens del login: tiene que ser larga, aleatoria y **no se sube al repo**
(`.env` está en `.gitignore`). Se puede generar con
`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

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
    users/                     # UsersService (sin controller: los usuarios se crean con /auth/register)
    auth/                      # register y login con JWT (TP 12)
prisma/
  schema.prisma                # 7 tablas con PK, FK y restricciones
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
| Registro (TP 12) | `POST /api/auth/register` |
| Inicio de sesión (TP 12) | `POST /api/auth/login` |

`GET /api/ordenes` acepta `?estado=abierta&pacienteId=<uuid>`.

### Autenticación (TP 12)

Los usuarios son una tabla propia (`usuarios`), distinta de `pacientes`. Para no duplicar el alta, **la única ruta que crea usuarios es `POST /api/auth/register`**: el módulo `users` no expone un controller.

```bash
POST /api/auth/register
{ "nombre": "Ana", "apellido": "Gómez", "email": "ana@example.com", "password": "Prueba1234" }
# 201 -> el usuario creado, sin la contraseña. Rol: recepcion

POST /api/auth/login
{ "email": "ana@example.com", "password": "Prueba1234" }
# 200 -> { "access_token": "eyJ...", "usuario": { id, nombre, apellido, email, rol } }
```

- La contraseña se guarda solo como hash de **bcrypt** (10 vueltas); nunca se devuelve.
- El email se guarda en minúsculas: `Ana@Example.com` y `ana@example.com` son el mismo usuario.
- Email repetido: **409**. Datos inválidos (email mal escrito, contraseña de menos de 8 caracteres): **400**.
- Login incorrecto: **401** con el mismo mensaje si el email no existe o si la contraseña no coincide, para no revelar qué emails están registrados.
- El token lleva `sub` (id del usuario), `email` y `rol`, y vence según `JWT_EXPIRES_IN`.
- Todo usuario nuevo queda con rol `recepcion`: nadie puede registrarse a sí mismo como `admin`.

**Usuarios de prueba** (los carga `npm run prisma:seed`, contraseña `Prueba1234` para todos):

| Email | Rol |
| --- | --- |
| `admin@lims.test` | admin |
| `bioquimico@lims.test` | bioquimico |
| `tecnico@lims.test` | tecnico |
| `recepcion@lims.test` | recepcion |
| `inactivo@lims.test` | recepcion, **inactivo** (el login responde 401) |

### Pruebas con Postman

La colección está en `postman/LIMS-Lab.postman_collection.json` (Postman → Import). Tiene 40 requests en carpetas numeradas por módulo, en el orden en que se corren:

```
00 · Estado de la API
01 · Autenticación
02 · Obras sociales
03 · Tipos de muestra
04 · Análisis
05 · Pacientes
06 · Órdenes
99 · Limpieza
```

Cada módulo tiene dos subcarpetas, y el nombre de cada request indica el código de estado que espera (por ejemplo, `Crear paciente → 201`):

- **Casos correctos**: listar, obtener, crear, actualizar y eliminar.
- **Casos de error**: un **"Crear con datos inválidos → 400"** por módulo, que manda datos incorrectos (campo obligatorio vacío, texto donde va un número, `activa`/`activo` distinto de true/false) y espera los mensajes de validación, más los conflictos (DNI o email repetido, 409) y los logins rechazados (401).

La carpeta **"01 · Autenticación"** registra un usuario con un email nuevo en cada corrida, prueba el email repetido (409) y los datos inválidos (400), inicia sesión y guarda el token en la variable `token`, y prueba el login con contraseña incorrecta y con un email no registrado (401). Como no hay ruta para borrar usuarios, los de prueba quedan en la base.

Con la API levantada y el seed cargado, se corre completa desde el **Runner**: los registros que crea los borra al final. La variable `baseUrl` de la colección apunta a `http://localhost:4000/api`.

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
| `usuarios` | PK `id` (uuid), `email` único, `password_hash` (bcrypt), `rol` |

Enums: `sexo` (`F`, `M`, `X`), `estado_orden` (`abierta`, `en_proceso`, `completa`,
`informada`, `anulada`) y `rol_usuario` (`admin`, `bioquimico`, `tecnico`, `recepcion`).

## Origen de los datos del seed

- **Catálogos reales** del LIMS (tipos de muestra, obras sociales y los 13 análisis con
  unidad, rango y días de demora): migraciones `20261021_01_catalogo_analisis.sql` y
  `20261022_01_fila_atencion.sql` de `axel674/LIMS-laboratorio-db`.
- **Pacientes y órdenes de ejemplo**: el LIMS no versiona sus filas de pacientes, así que el
  seed las arma con ese catálogo (5 pacientes, 6 órdenes, 12 ítems). El seed reinicia esas
  dos tablas cada vez que se corre; los catálogos se actualizan sin duplicar.

## Fuera de alcance

- Proteger las rutas con el token (guard de JWT) y los permisos por rol: la consigna del TP 12 pide solo registro y login.
- RLS, muestras, resultados, informes y cobros: son del proyecto LIMS React + Supabase.
