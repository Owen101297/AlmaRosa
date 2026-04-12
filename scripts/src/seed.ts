import { db, categoriesTable, productsTable, testimonialsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  await db.delete(productsTable);
  await db.delete(testimonialsTable);
  await db.delete(categoriesTable);

  const [conjuntos, brasieres, pijamas, bodys, deportiva] = await db
    .insert(categoriesTable)
    .values([
      { name: "Conjuntos", slug: "conjuntos", image: "/api/images/generated_images/generated_image_0.png" },
      { name: "Brasieres", slug: "brasieres", image: "/api/images/generated_images/generated_image_1.png" },
      { name: "Pijamas", slug: "pijamas", image: "/api/images/generated_images/generated_image_2.png" },
      { name: "Bodys", slug: "bodys", image: "/api/images/generated_images/generated_image_3.png" },
      { name: "Ropa Deportiva", slug: "ropa-deportiva", image: "/api/images/generated_images/generated_image_4.png" },
    ])
    .returning();

  await db.insert(productsTable).values([
    {
      name: "Conjunto Noir Elegance",
      description: "Conjunto de lenceria en encaje negro con detalles de seda. Elegante, comodo y sensual. Ideal para ocasiones especiales.",
      price: "89.99",
      salePrice: null,
      categoryId: conjuntos!.id,
      images: ["/api/images/generated_images/generated_image_0.png"],
      sizes: ["XS", "S", "M", "L", "XL"],
      featured: true,
      isNew: true,
    },
    {
      name: "Bralette Rose Satin",
      description: "Bralette de saten rosa con acabados delicados. Suave al tacto, perfecto para el dia a dia con un toque de lujo.",
      price: "49.99",
      salePrice: "39.99",
      categoryId: brasieres!.id,
      images: ["/api/images/generated_images/generated_image_1.png"],
      sizes: ["S", "M", "L"],
      featured: true,
      isNew: false,
    },
    {
      name: "Pijama Silk Dreams",
      description: "Pijama de seda en tono rosa suave. Maxima comodidad con un diseno elegante para tus noches.",
      price: "119.99",
      salePrice: null,
      categoryId: pijamas!.id,
      images: ["/api/images/generated_images/generated_image_2.png"],
      sizes: ["S", "M", "L", "XL"],
      featured: true,
      isNew: true,
    },
    {
      name: "Body Midnight Lace",
      description: "Body de encaje negro con transparencias elegantes. Diseno sofisticado que realza tu figura.",
      price: "69.99",
      salePrice: "54.99",
      categoryId: bodys!.id,
      images: ["/api/images/generated_images/generated_image_3.png"],
      sizes: ["XS", "S", "M", "L"],
      featured: true,
      isNew: false,
    },
    {
      name: "Set Deportivo Power",
      description: "Conjunto deportivo premium en negro. Soporte superior y estilo para tu rutina de ejercicio.",
      price: "79.99",
      salePrice: null,
      categoryId: deportiva!.id,
      images: ["/api/images/generated_images/generated_image_4.png"],
      sizes: ["S", "M", "L", "XL"],
      featured: false,
      isNew: true,
    },
  ]);

  await db.insert(testimonialsTable).values([
    {
      name: "Maria L.",
      comment: "Me encanto, super comodo y sexy. La calidad es increible, se nota que es premium.",
      rating: 5,
      avatar: "ML",
    },
    {
      name: "Carolina R.",
      comment: "Los conjuntos son hermosos. El envio fue rapido y el empaque muy bonito.",
      rating: 5,
      avatar: "CR",
    },
    {
      name: "Valentina G.",
      comment: "Mi pijama favorita de todos los tiempos. Suave, elegante y con un diseno precioso.",
      rating: 5,
      avatar: "VG",
    },
  ]);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
