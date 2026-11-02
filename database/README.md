# Base de datos simplificada

Versión reducida del esquema del LIMS para el TP: 8 tablas de PostgreSQL con integridad referencial y al menos 5 registros por tabla.

## Cómo cargarla

```bash
createdb lims
psql -d lims -f database/schema.sql
psql -d lims -f database/seed.sql
```

Después, en `.env`: `DATABASE_URL=postgresql://usuario:password@localhost:5432/lims`

## Tablas y relaciones

| Tabla | Descripción | Claves foráneas |
|---|---|---|
| `sucursales` | Sedes del laboratorio | |
| `obras_sociales` | Coberturas médicas | |
| `pacientes` | Personas atendidas | `obra_social_id` → `obras_sociales` (opcional) |
| `medicos` | Médicos que piden estudios | |
| `usuarios` | Personal (admin, recepción, bioquímico) | `sucursal_id` → `sucursales` |
| `analisis` | Catálogo de estudios con valores de referencia y precio | |
| `ordenes` | Pedido de análisis de un paciente | `paciente_id`, `medico_id` (opcional), `sucursal_id`, `usuario_id` |
| `orden_analisis` | Tabla intermedia N:M entre órdenes y análisis, con el resultado | `orden_id`, `analisis_id` |

```
sucursales 1──N usuarios
sucursales 1──N ordenes
obras_sociales 1──N pacientes 1──N ordenes N──1 medicos
usuarios 1──N ordenes
ordenes N──M analisis   (por orden_analisis)
```

## Restricciones

- `UNIQUE`: `dni` (pacientes y usuarios), `matricula`, `email` de usuarios, `codigo` de análisis, nombres de sucursal y obra social, y el par (`orden_id`, `analisis_id`).
- `CHECK`: `sexo` en F/M, `rol` y `estado` con valores fijos, `precio >= 0`, `valor_min <= valor_max`, fecha de nacimiento no futura.
- `ON DELETE CASCADE` en `orden_analisis` al borrar la orden; `SET NULL` en obra social y médico.
