import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL no está definido.");
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log("Conectando a la base de datos...");
    await client.connect();
    
    console.log("Leyendo archivo SQL...");
    const sqlPath = path.resolve(__dirname, '../../supabase', 'migrations', '001_initial_setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log("Ejecutando script de configuración inicial...");
    await client.query(sql);
    
    console.log("✅ Configuración de base de datos exitosa.");
    
  } catch (err) {
    console.error("❌ Error al configurar la base de datos:", err);
  } finally {
    await client.end();
  }
}

run();
