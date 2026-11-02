INSERT INTO sucursales (nombre, direccion, telefono) VALUES
 ('Sede Central',  'Av. Mate de Luna 1250, San Miguel de Tucumán', '381-4300001'),
 ('Sucursal Norte','Av. Sarmiento 450, San Miguel de Tucumán',     '381-4300002'),
 ('Sucursal Sur',  'Av. Belgrano 2100, San Miguel de Tucumán',     '381-4300003'),
 ('Yerba Buena',   'Av. Aconquija 900, Yerba Buena',               '381-4300004'),
 ('Tafí Viejo',    'Calle Alem 320, Tafí Viejo',                   '381-4300005');

INSERT INTO obras_sociales (nombre, telefono) VALUES
 ('OSDE',               '0810-555-6733'),
 ('Swiss Medical',      '0810-333-8876'),
 ('PAMI',               '138'),
 ('Subsidio de Salud',  '381-4300100'),
 ('Galeno',             '0810-999-4253');

INSERT INTO pacientes (dni, nombre, apellido, fecha_nacimiento, sexo, email, obra_social_id) VALUES
 ('30111222', 'María',   'Gómez',    '1985-03-14', 'F', 'maria.gomez@mail.com',    1),
 ('32444555', 'Juan',    'Pérez',    '1990-07-02', 'M', 'juan.perez@mail.com',     2),
 ('20987654', 'Rosa',    'Herrera',  '1952-11-23', 'F', NULL,                      3),
 ('38222333', 'Lucas',   'Ledesma',  '1998-01-30', 'M', 'lucas.ledesma@mail.com',  4),
 ('35666777', 'Camila',  'Acosta',   '1994-09-18', 'F', 'camila.acosta@mail.com',  5),
 ('27333444', 'Carlos',  'Navarro',  '1979-05-09', 'M', NULL,                      NULL);

INSERT INTO medicos (matricula, nombre, apellido, especialidad) VALUES
 ('MP-1001', 'Laura',   'Sosa',     'Clínica médica'),
 ('MP-1002', 'Ricardo', 'Díaz',     'Cardiología'),
 ('MP-1003', 'Elena',   'Vega',     'Endocrinología'),
 ('MP-1004', 'Martín',  'Rojas',    'Pediatría'),
 ('MP-1005', 'Silvia',  'Molina',   'Ginecología');

INSERT INTO usuarios (dni, nombre, apellido, email, rol, sucursal_id) VALUES
 ('25000001', 'Ana',     'Torres',  'ana.torres@lims.com',     'admin',      1),
 ('25000002', 'Pablo',   'Ruiz',    'pablo.ruiz@lims.com',     'recepcion',  1),
 ('25000003', 'Julia',   'Cruz',    'julia.cruz@lims.com',     'recepcion',  2),
 ('25000004', 'Diego',   'Salas',   'diego.salas@lims.com',    'bioquimico', 1),
 ('25000005', 'Marta',   'Luna',    'marta.luna@lims.com',     'bioquimico', 3);

INSERT INTO analisis (codigo, nombre, unidad, valor_min, valor_max, precio) VALUES
 ('GLU', 'Glucemia',          'mg/dL',  70.00,  110.00,  3500.00),
 ('COL', 'Colesterol total',  'mg/dL',   0.00,  200.00,  4000.00),
 ('TRI', 'Triglicéridos',     'mg/dL',   0.00,  150.00,  4200.00),
 ('UREA','Urea',              'mg/dL',  15.00,   45.00,  3800.00),
 ('CREA','Creatinina',        'mg/dL',   0.60,    1.30,  3800.00),
 ('HTO', 'Hematocrito',       '%',      36.00,   50.00,  3000.00);

INSERT INTO ordenes (fecha, estado, paciente_id, medico_id, sucursal_id, usuario_id) VALUES
 ('2026-10-26', 'entregada',  1, 1, 1, 2),
 ('2026-10-27', 'validada',   2, 2, 1, 2),
 ('2026-10-28', 'en_proceso', 3, 3, 2, 3),
 ('2026-10-29', 'en_proceso', 4, 4, 3, 3),
 ('2026-10-30', 'pendiente',  5, 5, 1, 2),
 ('2026-11-02', 'pendiente',  6, NULL, 2, 3);

INSERT INTO orden_analisis (orden_id, analisis_id, resultado) VALUES
 (1, 1,  92.00), (1, 2, 185.00), (1, 3, 120.00),
 (2, 1, 105.00), (2, 5,   0.90),
 (3, 4,  38.00), (3, 5,   1.10), (3, 6,  41.00),
 (4, 1,  88.00),
 (5, 2, NULL),   (5, 3, NULL),
 (6, 1, NULL);
