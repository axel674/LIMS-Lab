-- LIMS-Lab · Base de datos simplificada (PostgreSQL)
-- Ejecutar primero este archivo y después seed.sql

DROP TABLE IF EXISTS orden_analisis, ordenes, analisis, usuarios, medicos, pacientes, obras_sociales, sucursales CASCADE;

CREATE TABLE sucursales (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(80)  NOT NULL UNIQUE,
  direccion VARCHAR(120) NOT NULL,
  telefono  VARCHAR(30)
);

CREATE TABLE obras_sociales (
  id       SERIAL PRIMARY KEY,
  nombre   VARCHAR(80) NOT NULL UNIQUE,
  telefono VARCHAR(30)
);

CREATE TABLE pacientes (
  id               SERIAL PRIMARY KEY,
  dni              VARCHAR(10)  NOT NULL UNIQUE,
  nombre           VARCHAR(60)  NOT NULL,
  apellido         VARCHAR(60)  NOT NULL,
  fecha_nacimiento DATE         NOT NULL CHECK (fecha_nacimiento <= CURRENT_DATE),
  sexo             CHAR(1)      NOT NULL CHECK (sexo IN ('F', 'M')),
  email            VARCHAR(120),
  obra_social_id   INTEGER REFERENCES obras_sociales(id) ON DELETE SET NULL
);

CREATE TABLE medicos (
  id           SERIAL PRIMARY KEY,
  matricula    VARCHAR(20) NOT NULL UNIQUE,
  nombre       VARCHAR(60) NOT NULL,
  apellido     VARCHAR(60) NOT NULL,
  especialidad VARCHAR(60)
);

CREATE TABLE usuarios (
  id          SERIAL PRIMARY KEY,
  dni         VARCHAR(10)  NOT NULL UNIQUE,
  nombre      VARCHAR(60)  NOT NULL,
  apellido    VARCHAR(60)  NOT NULL,
  email       VARCHAR(120) NOT NULL UNIQUE,
  rol         VARCHAR(20)  NOT NULL CHECK (rol IN ('admin', 'recepcion', 'bioquimico')),
  sucursal_id INTEGER NOT NULL REFERENCES sucursales(id)
);

CREATE TABLE analisis (
  id         SERIAL PRIMARY KEY,
  codigo     VARCHAR(10)   NOT NULL UNIQUE,
  nombre     VARCHAR(80)   NOT NULL,
  unidad     VARCHAR(20),
  valor_min  NUMERIC(8,2),
  valor_max  NUMERIC(8,2),
  precio     NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
  CHECK (valor_min IS NULL OR valor_max IS NULL OR valor_min <= valor_max)
);

CREATE TABLE ordenes (
  id          SERIAL PRIMARY KEY,
  fecha       DATE        NOT NULL DEFAULT CURRENT_DATE,
  estado      VARCHAR(20) NOT NULL DEFAULT 'pendiente'
              CHECK (estado IN ('pendiente', 'en_proceso', 'validada', 'entregada')),
  paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
  medico_id   INTEGER REFERENCES medicos(id) ON DELETE SET NULL,
  sucursal_id INTEGER NOT NULL REFERENCES sucursales(id),
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id)
);

-- Tabla intermedia: una orden tiene varios análisis y un análisis está en varias órdenes
CREATE TABLE orden_analisis (
  id          SERIAL PRIMARY KEY,
  orden_id    INTEGER NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
  analisis_id INTEGER NOT NULL REFERENCES analisis(id),
  resultado   NUMERIC(10,2),
  UNIQUE (orden_id, analisis_id)
);
