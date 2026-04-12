/**
 * Imágenes de stock de lencería para la tienda Alma Rosa
 * URLs de imágenes gratuitas de Pexels/Unsplash
 */

export const PRODUCT_IMAGES = {
  // Lencería
  "lingerie-encaje-rosa":
    "https://images.unsplash.com/photo-1599414879424-5b475f8425a5?w=800&q=80",
  "lingerie-negra-elegante":
    "https://images.unsplash.com/photo-1571752726703-3a3d99e611bc?w=800&q=80",
  "lingerie-bordeaux":
    "https://images.unsplash.com/photo-1540339832862-3346bc2ab338?w=800&q=80",
  "lingerie-blanca-delicada":
    "https://images.unsplash.com/photo-1512496015851-a1fbbfc6ae87?w=800&q=80",
  "conjunto-rosa":
    "https://images.unsplash.com/photo-1556906781-4128abade3ca?w=800&q=80",

  // Batas
  "bata-saten-negra":
    "https://images.unsplash.com/photo-1618932260643-94a6e376d7b6?w=800&q=80",
  "bata-rosa":
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
  "kimono-rojo":
    "https://images.unsplash.com/photo-1583846783214-7028c9178b5e?w=800&q=80",

  // Conjuntos
  "conjunto-completo-negro":
    "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80",
  "conjunto-blanco":
    "https://images.unsplash.com/photo-1552374196-c4e7ffc6a126?w=800&q=80",

  // Complementos
  "medias-negras":
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
  "lace-trim":
    "https://images.unsplash.com/photo-1609298393801-d2c73e16ad79?w=800&q=80",
};

/**
 * Productos de ejemplo para la demo
 * Estos datos se pueden agregar a Supabase manualmente
 */
export const DEMO_PRODUCTS = [
  {
    name: "Conjunto Elegance Encaje",
    description:
      "Conjunto de lencería en encaje francés de alta calidad. Copa suave con relleno léger para un look natural. Tirantes ajustables.",
    price: 1299,
    salePrice: 999,
    categoryId: 1, // Lenceria
    images: [PRODUCT_IMAGES["lingerie-encaje-rosa"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    isNew: false,
    stock_quantity: 20,
  },
  {
    name: "Conjunto Sensual Noir",
    description:
      "Conjunto clásico en negro. Fabricado en tela suave que acaricia la piel. Cierre frontal facilita ponerse y quitarse.",
    price: 1099,
    salePrice: null,
    categoryId: 1,
    images: [PRODUCT_IMAGES["lingerie-negra-elegante"]],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
    isNew: true,
    stock_quantity: 15,
  },
  {
    name: "Conjunto Bordeaux Premium",
    description:
      "Conjunto exclusivo en color burdeos. Encaje detallado en el borde. Perfecto para ocasiones especiales.",
    price: 1499,
    salePrice: 1199,
    categoryId: 1,
    images: [PRODUCT_IMAGES["lingerie-bordeaux"]],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    isNew: true,
    stock_quantity: 10,
  },
  {
    name: "Conjunto Essential Blanco",
    description:
      "Conjunto básico y elegante en blanco algodón. Cómodo para el uso diario. Lavado a máquina sin problemas.",
    price: 799,
    salePrice: null,
    categoryId: 1,
    images: [PRODUCT_IMAGES["lingerie-blanca-delicada"]],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: false,
    isNew: false,
    stock_quantity: 30,
  },
  {
    name: "Bata Satén Noir",
    description:
      "Bata de satén negro con caída fluida. Mangas largas con abertura. Cierre de cinturón.",
    price: 1899,
    salePrice: 1499,
    categoryId: 2, // Batas
    images: [PRODUCT_IMAGES["bata-saten-negra"]],
    sizes: ["Única"],
    featured: true,
    isNew: false,
    stock_quantity: 8,
  },
  {
    name: "Bata Rose Luxe",
    description:
      "Bata de satén color rosa pálido. Acabado brillante. Talla única adaptable.",
    price: 1699,
    salePrice: null,
    categoryId: 2,
    images: [PRODUCT_IMAGES["bata-rosa"]],
    sizes: ["Única"],
    featured: false,
    isNew: true,
    stock_quantity: 12,
  },
  {
    name: "Kimono Japonés Rojo",
    description:
      "Kimono estilo japonés en rojo intenso. Bordados tradicionales en la espalda. Para noches especiales.",
    price: 2499,
    salePrice: 1999,
    categoryId: 2,
    images: [PRODUCT_IMAGES["kimono-rojo"]],
    sizes: ["S/M", "L/XL"],
    featured: true,
    isNew: true,
    stock_quantity: 5,
  },
  {
    name: "Conjunto Co coord",
    description:
      "Conjunto a juego completo. Top con tirantes y bottoms短裤. Combinación perfecta.",
    price: 1299,
    salePrice: null,
    categoryId: 3, // Sets
    images: [PRODUCT_IMAGES["conjunto-completo-negro"]],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
    isNew: false,
    stock_quantity: 18,
  },
  {
    name: "Conjunto Blanco Nupcial",
    description:
      "Conjunto especial para novias. Blanco puro con encaje detalle. Incluye banda decorativa.",
    price: 1899,
    salePrice: 1599,
    categoryId: 3,
    images: [PRODUCT_IMAGES["conjunto-blanco"]],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
    isNew: true,
    stock_quantity: 10,
  },
  {
    name: "Medias Negro Premium",
    description:
      "Medias de red negras de alta calidad. Denier 15. Cinturón incluido.",
    price: 399,
    salePrice: 299,
    categoryId: 4, // Complementos
    images: [PRODUCT_IMAGES["medias-negras"]],
    sizes: ["S/M", "M/L"],
    featured: false,
    isNew: false,
    stock_quantity: 25,
  },
];

export const DEMO_CATEGORIES = [
  { name: "Lencería", slug: "lenceria" },
  { name: "Batas", slug: "batas" },
  { name: "Conjuntos", slug: "sets" },
  { name: "Complementos", slug: "complementos" },
];

// Función para obtener las URLs de las imágenes
export function getProductImageUrl(key: string): string {
  return PRODUCT_IMAGES[key] || PRODUCT_IMAGES["lingerie-negra-elegante"];
}

// Función para obtener todos los productos con imágenes reales
export function getProductsWithImages() {
  return DEMO_PRODUCTS.map((product, index) => {
    const imageKeys = Object.keys(PRODUCT_IMAGES);
    const imageKey = imageKeys[index % imageKeys.length];
    return {
      ...product,
      images: [PRODUCT_IMAGES[imageKey]],
    };
  });
}
