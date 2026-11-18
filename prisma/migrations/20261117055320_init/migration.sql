-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('F', 'M', 'X');

-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('abierta', 'en_proceso', 'completa', 'informada', 'anulada');

-- CreateTable
CREATE TABLE "obras_sociales" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "obras_sociales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_muestra" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tubo" TEXT,

    CONSTRAINT "tipos_muestra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analisis" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo_muestra_id" BIGINT NOT NULL,
    "unidad" TEXT,
    "valor_ref_min" DECIMAL(12,3),
    "valor_ref_max" DECIMAL(12,3),
    "valor_ref_texto" TEXT,
    "dias_demora" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ub" DECIMAL(10,2),
    "codigo_nbu" TEXT,

    CONSTRAINT "analisis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" UUID NOT NULL,
    "dni" VARCHAR(10) NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "sexo" "Sexo",
    "telefono" TEXT,
    "email" TEXT,
    "domicilio" TEXT,
    "obra_social_id" BIGINT,
    "nro_afiliado" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes" (
    "id" UUID NOT NULL,
    "nro_orden" TEXT NOT NULL,
    "paciente_id" UUID NOT NULL,
    "obra_social_id" BIGINT,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'abierta',
    "fecha_orden" DATE NOT NULL,
    "fecha_recepcion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT,
    "motivo_anulacion" TEXT,
    "anulada_en" TIMESTAMPTZ(6),

    CONSTRAINT "ordenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_analisis" (
    "id" UUID NOT NULL,
    "orden_id" UUID NOT NULL,
    "analisis_id" BIGINT NOT NULL,
    "cubierto" BOOLEAN NOT NULL DEFAULT true,
    "ub" DECIMAL(10,2),
    "valor_ub" DECIMAL(12,2),
    "importe_obra_social" DECIMAL(12,2),
    "importe_paciente" DECIMAL(12,2),

    CONSTRAINT "orden_analisis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "obras_sociales_nombre_key" ON "obras_sociales"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "obras_sociales_codigo_key" ON "obras_sociales"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_muestra_nombre_key" ON "tipos_muestra"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "analisis_codigo_key" ON "analisis"("codigo");

-- CreateIndex
CREATE INDEX "analisis_tipo_muestra_id_idx" ON "analisis"("tipo_muestra_id");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_dni_key" ON "pacientes"("dni");

-- CreateIndex
CREATE INDEX "pacientes_obra_social_id_idx" ON "pacientes"("obra_social_id");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_nro_orden_key" ON "ordenes"("nro_orden");

-- CreateIndex
CREATE INDEX "ordenes_paciente_id_idx" ON "ordenes"("paciente_id");

-- CreateIndex
CREATE INDEX "ordenes_obra_social_id_idx" ON "ordenes"("obra_social_id");

-- CreateIndex
CREATE INDEX "orden_analisis_analisis_id_idx" ON "orden_analisis"("analisis_id");

-- CreateIndex
CREATE UNIQUE INDEX "orden_analisis_orden_id_analisis_id_key" ON "orden_analisis"("orden_id", "analisis_id");

-- AddForeignKey
ALTER TABLE "analisis" ADD CONSTRAINT "analisis_tipo_muestra_id_fkey" FOREIGN KEY ("tipo_muestra_id") REFERENCES "tipos_muestra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_obra_social_id_fkey" FOREIGN KEY ("obra_social_id") REFERENCES "obras_sociales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_obra_social_id_fkey" FOREIGN KEY ("obra_social_id") REFERENCES "obras_sociales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_analisis" ADD CONSTRAINT "orden_analisis_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_analisis" ADD CONSTRAINT "orden_analisis_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "analisis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
