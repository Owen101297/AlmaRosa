import pg from "pg";

const { Client } = pg;
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL no está definido.");
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

// Imágenes de alta calidad de Unsplash para lenquería
const IMAGES = {
  floral:
    "https://images.unsplash.com/photo-1556906781-4128abade3ca?w=800&q=80",
  satin:
    "https://images.unsplash.com/photo-1618932260643-94a6e376d7b6?w=800&q=80",
  balcony:
    "https://images.unsplash.com/photo-1620606626600-b8d1b11ce838?w=800&q=80",
  kimono:
    "https://images.unsplash.com/photo-1522851167425-412f7166ddf2?w=800&q=80",
  essentials:
    "https://images.unsplash.com/photo-1434389678232-0697aee29e71?w=800&q=80",
  body: "https://images.unsplash.com/photo-1582294191319-33824f114c0a?w=800&q=80",
  red: "https://images.unsplash.com/photo-1540339832862-3346bc2ab338?w=800&q=80",
  white:
    "https://images.unsplash.com/photo-1512496015851-a1fbbfc6ae87?w=800&q=80",
  lace: "https://images.unsplash.com/photo-1599414879424-5b475f8425a5?w=800&q=80",
  black:
    "https://images.unsplash.com/photo-1571752726703-3a3d99e611bc?w=800&q=80",
};

const categories = [
  { name: "Lencería", slug: "lenceria", description: "Conjuntos de lencería" },
  { name: "Batas", slug: "batas", description: "Batas y kimonos" },
  { name: "Conjuntos", slug: "sets", description: "Conjuntos completos" },
  { name: "Complementos", slug: "complementos", description: "Complementos" },
];

const products = [
  {
    name: "Conjunto Lencría Encaje Flora",
    description:
      "Exclusivo conjunto de encaje delicado con motivos florales, pensado para días especiales y noches románticas.",
    price: 850.0,
    sale_price: 700.0,
    category_id: 1,
    images: [IMAGES.floral],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
    is_new: true,
    stock_quantity: 50,
  },
  {
    name: "Bata Satín Noche",
    description:
      "Bata de satín importado que acaricia la piel, ideal para salir de la cama con el mayor lujo y suavidad.",
    price: 1200.0,
    sale_price: null,
    category_id: 2,
    images: [IMAGES.satin],
    sizes: ["Unitalla"],
    featured: true,
    is_new: false,
    stock_quantity: 20,
  },
  {
    name: "Brasier Balconette París",
    description:
      "Elegancia pura. Copas tipo balconette para un realce natural y cómodo, de tela transpirable y fina.",
    price: 650.0,
    sale_price: 500.0,
    category_id: 1,
    images: [IMAGES.balcony],
    sizes: ["32B", "34B", "36B", "34C", "36C"],
    featured: false,
    is_new: true,
    stock_quantity: 30,
  },
  {
    name: "Kimono Encaje Noir",
    description:
      "El complemento perfecto para tu conjunto. Un kimono largo translúcido y seductor con ribetes de encaje francés.",
    price: 1500.0,
    sale_price: 1250.0,
    category_id: 2,
    images: [IMAGES.kimono],
    sizes: ["CH-M", "G-XG"],
    featured: true,
    is_new: false,
    stock_quantity: 15,
  },
  {
    name: "Set de Complementos Essentiel",
    description:
      "Pack esencial que incluye dos prendas inferiores, banda y accesorios complementarios en armonía con toda tu colección.",
    price: 450.0,
    sale_price: null,
    category_id: 4,
    images: [IMAGES.essentials],
    sizes: ["Unitalla"],
    featured: false,
    is_new: false,
    stock_quantity: 100,
  },
  {
    name: "Body Lencrería Escote en V",
    description:
      "Impactante body lencero con gran elasticidad y un escote que resalta tus atributos, garantizando máximo confort.",
    price: 1100.0,
    sale_price: null,
    category_id: 1,
    images: [IMAGES.body],
    sizes: ["S", "M", "L"],
    featured: true,
    is_new: true,
    stock_quantity: 40,
  },
];

const testimonials = [
  {
    name: "Andrea M.",
    comment:
      "La calidad del satín es insuperable. El kimono super todas mis expectativas.",
    rating: 5,
  },
  {
    name: "Sofía G.",
    comment:
      "Me encanta cómo entalla el balconette. Son prendas que empoderan.",
    rating: 5,
  },
  {
    name: "Camila R.",
    comment: "Envío súper rápido y el conjunto flora es espectacular.",
    rating: 4,
  },
];

async function run() {
  try {
    console.log("Conectando a la base de datos...");
    await client.connect();

    // 1. Crear/actualizar categorías
    console.log("1. Sincronizando categorías...");
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const res = await client.query(
        "SELECT id FROM categories WHERE slug = $1",
        [cat.slug],
      );
      if (res.rows.length > 0) {
        await client.query(
          "UPDATE categories SET name=$1, description=$2 WHERE id=$3",
          [cat.name, cat.description, res.rows[0].id],
        );
        console.log(`  ✅ Categoría actualizada: ${cat.name}`);
      } else {
        await client.query(
          "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3)",
          [cat.name, cat.slug, cat.description],
        );
        console.log(`  ➕ Categoría creada: ${cat.name}`);
      }
    }

    // 2. Obtener IDs de categorías
    console.log("2. Obteniendo IDs de categorías...");
    const categoryMap = new Map();
    const catRes = await client.query("SELECT id, slug FROM categories");
    for (const row of catRes.rows) {
      categoryMap.set(row.slug, row.id);
      console.log(`  - ${row.slug} = ${row.id}`);
    }

    // 3. Actualizar productos
    console.log("3. Actualizando productos...");
    let updatedCount = 0;
    let createdCount = 0;

    for (const p of products) {
      // Mapear category_id basado en slug
      const catSlug = categories[p.category_id - 1]?.slug;
      const newCatId = categoryMap.get(catSlug);

      if (!newCatId) {
        console.log(`  ⚠️ Categoría no encontrada para: ${p.name}`);
        continue;
      }

      const res = await client.query(
        "SELECT id FROM products WHERE name = $1",
        [p.name],
      );
      if (res.rows.length > 0) {
        await client.query(
          "UPDATE products SET description=$1, price=$2, sale_price=$3, category_id=$4, images=$5, sizes=$6, featured=$7, is_new=$8, stock_quantity=$9 WHERE id=$10",
          [
            p.description,
            p.price,
            p.sale_price,
            newCatId,
            JSON.stringify(p.images),
            JSON.stringify(p.sizes),
            p.featured,
            p.is_new,
            p.stock_quantity,
            res.rows[0].id,
          ],
        );
        updatedCount++;
        console.log(`  ✅ Actualizado: ${p.name}`);
      } else {
        await client.query(
          "INSERT INTO products (name, description, price, sale_price, category_id, images, sizes, featured, is_new, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
          [
            p.name,
            p.description,
            p.price,
            p.sale_price,
            newCatId,
            JSON.stringify(p.images),
            JSON.stringify(p.sizes),
            p.featured,
            p.is_new,
            p.stock_quantity,
          ],
        );
        createdCount++;
        console.log(`  ➕ Creado: ${p.name}`);
      }
    }

    // 4. Actualizar testimonios
    console.log("4. Actualizando testimonios...");
    for (const t of testimonials) {
      const res = await client.query(
        "SELECT id FROM testimonials WHERE name = $1",
        [t.name],
      );
      if (res.rows.length === 0) {
        await client.query(
          "INSERT INTO testimonials (name, comment, rating) VALUES ($1, $2, $3)",
          [t.name, t.comment, t.rating],
        );
        console.log(`  ✅ Testimonio: ${t.name}`);
      }
    }

    console.log(`\n✅ Proceso completado:`);
    console.log(`   - ${categories.length} categorías`);
    console.log(`   - ${updatedCount} productos actualizados`);
    console.log(`   - ${createdCount} productos creados`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
