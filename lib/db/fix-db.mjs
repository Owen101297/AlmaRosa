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
    await client.query("UPDATE categories SET image = 'https://images.unsplash.com/photo-1512496015851-a1fbbfc6ae87' WHERE image IS NULL");
    console.log("Categorias actualizadas");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
