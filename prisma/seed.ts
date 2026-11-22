/**
 * Seed del TP 9/10/11/12.
 *
 * Los catalogos (tipos de muestra, obras sociales y analisis) son los datos
 * reales del LIMS: salen de axel674/LIMS-laboratorio-db, migraciones
 * 20261021_01_catalogo_analisis.sql y 20261022_01_fila_atencion.sql.
 *
 * Los pacientes y las ordenes son datos de ejemplo, armados con ese mismo
 * catalogo, porque el LIMS real no versiona las filas de pacientes.
 *
 * Uso: npm run prisma:seed
 * Ojo: el seed reinicia pacientes y ordenes (no toca los catalogos).
 *
 * TP 12: carga 5 usuarios de prueba (uno por rol y uno inactivo), todos con la
 * contrasena PASSWORD_USUARIOS_PRUEBA, guardada como hash de bcrypt. Los usuarios
 * que se registren con /api/auth/register no se borran.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient, RolUsuario } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const tiposMuestra = [
  { nombre: 'Sangre entera', tubo: 'Tapa lila (EDTA)' },
  { nombre: 'Suero', tubo: 'Tapa roja o amarilla (con gel)' },
  { nombre: 'Plasma citratado', tubo: 'Tapa celeste (citrato)' },
  { nombre: 'Orina', tubo: 'Frasco estéril' },
  { nombre: 'Materia fecal', tubo: 'Frasco con conservante' },
];

const obrasSociales = [
  { nombre: 'PAMI', codigo: 'PAMI' },
  { nombre: 'Subsidio de Salud', codigo: 'SUBSIDIO' },
  { nombre: 'OSDE', codigo: 'OSDE' },
  { nombre: 'Swiss Medical', codigo: 'SWISS' },
  { nombre: 'Galeno', codigo: 'GALENO' },
  { nombre: 'Medifé', codigo: 'MEDIFE' },
  { nombre: 'Sancor Salud', codigo: 'SANCOR' },
  { nombre: 'OSECAC', codigo: 'OSECAC' },
  { nombre: 'OSPRERA', codigo: 'OSPRERA' },
  { nombre: 'Unión Personal', codigo: 'UP' },
];

const analisis = [
  { codigo: 'HTO', nombre: 'Hematocrito', tipo: 'Sangre entera', unidad: '%', min: 36, max: 50, dias: 1, ub: 0.5 },
  { codigo: 'HB', nombre: 'Hemoglobina', tipo: 'Sangre entera', unidad: 'g/dL', min: 12, max: 17, dias: 1, ub: 0.5 },
  { codigo: 'GB', nombre: 'Glóbulos blancos', tipo: 'Sangre entera', unidad: '/mm³', min: 4000, max: 10000, dias: 1, ub: 0.5 },
  { codigo: 'PLAQ', nombre: 'Recuento de plaquetas', tipo: 'Sangre entera', unidad: '/mm³', min: 150000, max: 400000, dias: 1, ub: 0.5 },
  { codigo: 'GLU', nombre: 'Glucemia', tipo: 'Suero', unidad: 'mg/dL', min: 70, max: 110, dias: 1, ub: 0.6 },
  { codigo: 'URE', nombre: 'Uremia', tipo: 'Suero', unidad: 'mg/dL', min: 15, max: 45, dias: 1, ub: 0.6 },
  { codigo: 'CREA', nombre: 'Creatinina', tipo: 'Suero', unidad: 'mg/dL', min: 0.6, max: 1.2, dias: 1, ub: 0.6 },
  { codigo: 'COL', nombre: 'Colesterol total', tipo: 'Suero', unidad: 'mg/dL', max: 200, dias: 1, ub: 0.8 },
  { codigo: 'TG', nombre: 'Triglicéridos', tipo: 'Suero', unidad: 'mg/dL', max: 150, dias: 1, ub: 0.8 },
  { codigo: 'TSH', nombre: 'Tirotrofina (TSH)', tipo: 'Suero', unidad: 'µUI/mL', min: 0.4, max: 4, dias: 2, ub: 1.2 },
  { codigo: 'TP', nombre: 'Tiempo de protrombina', tipo: 'Plasma citratado', unidad: 's', min: 11, max: 14, dias: 1, ub: 1 },
  { codigo: 'ORINA', nombre: 'Orina completa', tipo: 'Orina', texto: 'Ver informe', dias: 1, ub: 0.7 },
  { codigo: 'SOMF', nombre: 'Sangre oculta en materia fecal', tipo: 'Materia fecal', texto: 'Negativo', dias: 2, ub: 1.1 },
];

const pacientes = [
  {
    dni: '40111222',
    nombre: 'Juan',
    apellido: 'Prueba',
    fechaNacimiento: '1997-05-14',
    sexo: 'M',
    telefono: '3815551234',
    email: 'juan.prueba@example.com',
    domicilio: 'San Miguel de Tucumán',
    obraSocial: 'OSDE',
    nroAfiliado: '6100123',
  },
  {
    dni: '35678901',
    nombre: 'María',
    apellido: 'Gómez',
    fechaNacimiento: '1991-09-02',
    sexo: 'F',
    telefono: '3815552345',
    email: 'maria.gomez@example.com',
    domicilio: 'Yerba Buena',
    obraSocial: 'PAMI',
    nroAfiliado: '4400987',
  },
  {
    dni: '28990123',
    nombre: 'Carlos',
    apellido: 'Ruiz',
    fechaNacimiento: '1980-01-20',
    sexo: 'M',
    telefono: '3815553456',
    domicilio: 'Concepción',
  },
  {
    dni: '45012345',
    nombre: 'Lucía',
    apellido: 'Fernández',
    fechaNacimiento: '2003-11-30',
    sexo: 'F',
    telefono: '3815554567',
    email: 'lucia.fernandez@example.com',
    obraSocial: 'Sancor Salud',
    nroAfiliado: 'SC-778812',
  },
  {
    dni: '12003456',
    nombre: 'Rosa',
    apellido: 'Díaz',
    fechaNacimiento: '1955-03-08',
    sexo: 'F',
    telefono: '3815555678',
    obraSocial: 'PAMI',
    nroAfiliado: '4401122',
  },
];

const ordenes = [
  {
    nroOrden: 'ORD-2026-000001',
    pacienteDni: '40111222',
    estado: 'informada',
    fechaOrden: '2026-11-02',
    observaciones: 'Control anual',
    analisis: ['HTO', 'HB', 'GB'],
  },
  {
    nroOrden: 'ORD-2026-000002',
    pacienteDni: '35678901',
    estado: 'en_proceso',
    fechaOrden: '2026-11-05',
    observaciones: 'Perfil renal',
    analisis: ['GLU', 'URE', 'CREA'],
  },
  {
    nroOrden: 'ORD-2026-000003',
    pacienteDni: '28990123',
    estado: 'abierta',
    fechaOrden: '2026-11-10',
    observaciones: 'Sin pedido médico: particular',
    analisis: ['COL', 'TG'],
  },
  {
    nroOrden: 'ORD-2026-000004',
    pacienteDni: '45012345',
    estado: 'completa',
    fechaOrden: '2026-11-12',
    analisis: ['ORINA'],
  },
  {
    nroOrden: 'ORD-2026-000005',
    pacienteDni: '12003456',
    estado: 'abierta',
    fechaOrden: '2026-11-14',
    observaciones: 'Paciente derivada por su médico de cabecera',
    analisis: ['TSH', 'TP'],
  },
  {
    nroOrden: 'ORD-2026-000006',
    pacienteDni: '35678901',
    estado: 'anulada',
    fechaOrden: '2026-11-06',
    observaciones: 'Orden duplicada',
    motivoAnulacion: 'Se cargó dos veces la misma orden',
    analisis: ['HB'],
  },
];

// Contrasena de los usuarios de prueba (solo para desarrollo y la demo)
const PASSWORD_USUARIOS_PRUEBA = 'Prueba1234';

const usuarios: { nombre: string; apellido: string; email: string; rol: RolUsuario; activo: boolean }[] = [
  { nombre: 'Laura', apellido: 'Medina', email: 'admin@lims.test', rol: 'admin', activo: true },
  { nombre: 'Carlos', apellido: 'Ruiz', email: 'bioquimico@lims.test', rol: 'bioquimico', activo: true },
  { nombre: 'Sofia', apellido: 'Paz', email: 'tecnico@lims.test', rol: 'tecnico', activo: true },
  { nombre: 'Martin', apellido: 'Lopez', email: 'recepcion@lims.test', rol: 'recepcion', activo: true },
  // Inactivo: sirve para mostrar que el login lo rechaza con 401
  { nombre: 'Julia', apellido: 'Sosa', email: 'inactivo@lims.test', rol: 'recepcion', activo: false },
];

async function main() {
  console.log('Cargando catálogos...');

  for (const tipo of tiposMuestra) {
    await prisma.tipoMuestra.upsert({
      where: { nombre: tipo.nombre },
      update: { tubo: tipo.tubo },
      create: tipo,
    });
  }

  for (const obraSocial of obrasSociales) {
    await prisma.obraSocial.upsert({
      where: { nombre: obraSocial.nombre },
      update: { codigo: obraSocial.codigo },
      create: obraSocial,
    });
  }

  const tiposPorNombre = new Map(
    (await prisma.tipoMuestra.findMany()).map((tipo) => [tipo.nombre, tipo.id]),
  );

  for (const item of analisis) {
    const tipoMuestraId = tiposPorNombre.get(item.tipo);

    if (!tipoMuestraId) {
      throw new Error(`Falta el tipo de muestra ${item.tipo}`);
    }

    const datos = {
      nombre: item.nombre,
      tipoMuestraId,
      unidad: item.unidad ?? null,
      valorRefMin: item.min ?? null,
      valorRefMax: item.max ?? null,
      valorRefTexto: item.texto ?? null,
      diasDemora: item.dias,
      ub: item.ub,
    };

    await prisma.analisis.upsert({
      where: { codigo: item.codigo },
      update: datos,
      create: { codigo: item.codigo, ...datos },
    });
  }

  console.log('Reiniciando pacientes y órdenes de ejemplo...');

  // Las órdenes caen en cascada con sus ítems.
  await prisma.orden.deleteMany();
  await prisma.paciente.deleteMany();

  const obrasPorNombre = new Map(
    (await prisma.obraSocial.findMany()).map((obraSocial) => [
      obraSocial.nombre,
      obraSocial.id,
    ]),
  );
  const analisisPorCodigo = new Map(
    (await prisma.analisis.findMany()).map((item) => [item.codigo, item]),
  );

  const pacientesCreados = new Map<string, { id: string; obraSocialId: bigint | null }>();

  for (const paciente of pacientes) {
    const obraSocialId = paciente.obraSocial
      ? (obrasPorNombre.get(paciente.obraSocial) ?? null)
      : null;

    const creado = await prisma.paciente.create({
      data: {
        dni: paciente.dni,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        fechaNacimiento: new Date(paciente.fechaNacimiento),
        sexo: paciente.sexo,
        telefono: paciente.telefono ?? null,
        email: paciente.email ?? null,
        domicilio: paciente.domicilio ?? null,
        obraSocialId,
        nroAfiliado: paciente.nroAfiliado ?? null,
      },
    });

    pacientesCreados.set(paciente.dni, {
      id: creado.id,
      obraSocialId: creado.obraSocialId,
    });
  }

  for (const orden of ordenes) {
    const paciente = pacientesCreados.get(orden.pacienteDni);

    if (!paciente) {
      throw new Error(`Falta el paciente ${orden.pacienteDni}`);
    }

    await prisma.orden.create({
      data: {
        nroOrden: orden.nroOrden,
        pacienteId: paciente.id,
        obraSocialId: paciente.obraSocialId,
        estado: orden.estado,
        fechaOrden: new Date(orden.fechaOrden),
        observaciones: orden.observaciones ?? null,
        motivoAnulacion: orden.motivoAnulacion ?? null,
        anuladaEn: orden.estado === 'anulada' ? new Date(orden.fechaOrden) : null,
        items: {
          create: orden.analisis.map((codigo) => {
            const item = analisisPorCodigo.get(codigo);

            if (!item) {
              throw new Error(`Falta el análisis ${codigo}`);
            }

            return {
              analisisId: item.id,
              cubierto: paciente.obraSocialId !== null,
              ub: item.ub,
            };
          }),
        },
      },
    });
  }

  console.log('Cargando usuarios de prueba...');
  const passwordHash = await bcrypt.hash(PASSWORD_USUARIOS_PRUEBA, 10);
  for (const usuario of usuarios) {
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: { ...usuario, passwordHash },
      create: { ...usuario, passwordHash },
    });
  }

  const resumen = {
    tiposMuestra: await prisma.tipoMuestra.count(),
    obrasSociales: await prisma.obraSocial.count(),
    analisis: await prisma.analisis.count(),
    pacientes: await prisma.paciente.count(),
    ordenes: await prisma.orden.count(),
    ordenAnalisis: await prisma.ordenAnalisis.count(),
    usuarios: await prisma.usuario.count(),
  };

  console.table(resumen);
}

main()
  .catch((error) => {
    console.error('Error en el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
