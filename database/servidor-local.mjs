// Levanta una base PostgreSQL local (PGlite) en localhost:5432.
// Los datos se guardan en database/.data. Para empezar de cero, borrar esa carpeta.
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const aqui = (archivo) => fileURLToPath(new URL(archivo, import.meta.url));
const PUERTO = Number(process.env.DB_PORT ?? 5432);

const db = new PGlite(aqui('./.data'));
await db.waitReady;

const { rows } = await db.query("SELECT to_regclass('public.pacientes') AS tabla");
if (!rows[0].tabla) {
  console.log('Primera ejecucion: creando tablas y cargando datos de prueba...');
  await db.exec(readFileSync(aqui('./schema.sql'), 'utf8'));
  await db.exec(readFileSync(aqui('./seed.sql'), 'utf8'));
}

const servidor = new PGLiteSocketServer({ db, port: PUERTO, host: '127.0.0.1' });
await servidor.start();
console.log(`Base de datos lista en postgresql://postgres@localhost:${PUERTO}/postgres`);
console.log('Dejar esta ventana abierta. Para apagarla: Ctrl + C');

const apagar = async () => {
  await servidor.stop();
  await db.close();
  process.exit(0);
};
process.on('SIGINT', apagar);
process.on('SIGTERM', apagar);
