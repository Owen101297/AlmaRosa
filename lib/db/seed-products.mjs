import pg from 'pg';

const { Client } = pg;
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL no está definido.");
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

const products = [
  {
    name: 'Conjunto Lencería Encaje Flora',
    description: 'Exclusivo conjunto de encaje delicado con motivos florales, pensado para días especiales y noches románticas.',
    price: 850.00,
    sale_price: 700.00,
    category_id: 1,
    images: ['/images/product-flora.png'],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
    is_new: true,
    stock_quantity: 50
  },
  {
    name: 'Bata Satín Noche',
    description: 'Bata de satín importado que acaricia la piel, ideal para salir de la cama con el mayor lujo y suavidad.',
    price: 1200.00,
    sale_price: null,
    category_id: 2,
    images: ['/images/product-bata-satin.png'],
    sizes: ["Unitalla"],
    featured: true,
    is_new: false,
    stock_quantity: 20
  },
  {
    name: 'Brasier Balconette París',
    description: 'Elegancia pura. Copas tipo balconette para un realce natural y cómodo, de tela transpirable y fina.',
    price: 650.00,
    sale_price: 500.00,
    category_id: 1,
    images: ['https://images.unsplash.com/photo-1620606626600-b8d1b11ce838?q=80&w=800&auto=format&fit=crop'],
    sizes: ["32B", "34B", "36B", "34C", "36C"],
    featured: false,
    is_new: true,
    stock_quantity: 30
  },
  {
    name: 'Kimono Encaje Noir',
    description: 'El complemento perfecto para tu conjunto. Un kimono largo translúcido y seductor con ribetes de encaje francés.',
    price: 1500.00,
    sale_price: 1250.00,
    category_id: 2,
    images: ['https://images.unsplash.com/photo-1522851167425-412f7166ddf2?q=80&w=800&auto=format&fit=crop'],
    sizes: ["CH-M", "G-XG"],
    featured: true,
    is_new: false,
    stock_quantity: 15
  },
  {
    name: 'Set de Complementos Essentiel',
    description: 'Pack esencial que incluye dos prendas inferiores, banda y accesorios complementarios en armonía con toda tu colección.',
    price: 450.00,
    sale_price: null,
    category_id: 3,
    images: ['https://images.unsplash.com/photo-1434389678232-0697aee29e71?q=80&w=800&auto=format&fit=crop'],
    sizes: ["Unitalla"],
    featured: false,
    is_new: false,
    stock_quantity: 100
  },
  {
    name: 'Body Lencería Escote en V',
    description: 'Impactante body lencero con gran elasticidad y un escote que resalta tus atributos, garantizando máximo confort.',
    price: 1100.00,
    sale_price: null,
    category_id: 1,
    images: ['https://images.unsplash.com/photo-1582294191319-33824f114c0a?q=80&w=800&auto=format&fit=crop'],
    sizes: ["S", "M", "L"],
    featured: true,
    is_new: true,
    stock_quantity: 40
  }
];

const testimonials = [
  { name: 'Andrea M.', comment: 'La calidad del satín es insuperable. El kimono superó todas mis expectativas.', rating: 5 },
  { name: 'Sofía G.', comment: 'Me encanta cómo entalla el balconette. Son prendas que empoderan.', rating: 5 },
  { name: 'Camila R.', comment: 'Envío súper rápido y el conjunto flora es espectacular.', rating: 4 }
];

async function run() {
  try {
    console.log("Conectando a la base de datos...");
    await client.connect();
    
    console.log("Poblando Base de Datos con Productos...");
    for (const p of products) {
      const res = await client.query("SELECT id FROM products WHERE name = $1", [p.name]);
      if (res.rows.length > 0) {
        await client.query(
          "UPDATE products SET description=$1, price=$2, sale_price=$3, category_id=$4, images=$5, sizes=$6, featured=$7, is_new=$8, stock_quantity=$9 WHERE id=$10",
          [p.description, p.price, p.sale_price, p.category_id, JSON.stringify(p.images), JSON.stringify(p.sizes), p.featured, p.is_new, p.stock_quantity, res.rows[0].id]
        );
      } else {
        await client.query(
          "INSERT INTO products (name, description, price, sale_price, category_id, images, sizes, featured, is_new, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
          [p.name, p.description, p.price, p.sale_price, p.category_id, JSON.stringify(p.images), JSON.stringify(p.sizes), p.featured, p.is_new, p.stock_quantity]
        );
      }
    }

    console.log("Poblando Base de Datos con Testimonios...");
    for (const t of testimonials) {
      const res = await client.query("SELECT id FROM testimonials WHERE name = $1 AND comment = $2", [t.name, t.comment]);
      if (res.rows.length === 0) {
        await client.query(
          "INSERT INTO testimonials (name, comment, rating) VALUES ($1, $2, $3)",
          [t.name, t.comment, t.rating]
        );
      }
    }
    
    console.log("✅ Tienda poblada exitosamente.");
    
  } catch (err) {
    console.error("❌ Error poblando datos:", err);
  } finally {
    await client.end();
  }
}

run();
