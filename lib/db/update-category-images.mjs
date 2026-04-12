import pg from 'pg';

const { Client } = pg;
const dbUrl = process.env.DATABASE_URL;

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    
    console.log("Actualizando imágenes de categorías...");
    
    await client.query("UPDATE categories SET image = '/images/category-lenceria.png' WHERE slug = 'lenceria'");
    await client.query("UPDATE categories SET image = '/images/category-batas.png' WHERE slug = 'batas'");
    await client.query("UPDATE categories SET image = '/images/category-complementos.png' WHERE slug = 'complementos'");
    
    console.log("✅ Imágenes actualizadas correctamente.");
  } catch (err) {
    console.error("❌ Error actualizando categorías:", err);
  } finally {
    await client.end();
  }
}

run();
