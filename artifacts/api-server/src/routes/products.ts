import { Router, type IRouter } from "express";
import {
  eq,
  and,
  gte,
  lte,
  desc,
  asc,
  sql,
  count as drizzleCount,
} from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  GetProductParams,
  GetProductResponse,
  ListNewArrivalsQueryParams,
  ListNewArrivalsResponse,
  ListOnSaleProductsResponse,
  GetProductsSummaryResponse,
} from "@workspace/api-zod";

interface CreateProductBody {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: number;
  images: string[];
  sizes: string[];
  featured?: boolean;
  isNew?: boolean;
  stockQuantity?: number;
}

interface UpdateProductBody extends Partial<CreateProductBody> {
  id: number;
}

const router: IRouter = Router();

function transformProduct(row: any) {
  let images = row.images;
  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch (e) {
      images = [];
    }
  }

  let sizes = row.sizes;
  if (typeof sizes === "string") {
    try {
      sizes = JSON.parse(sizes);
    } catch (e) {
      sizes = [];
    }
  }

  // Explicit mapping of snake_case to camelCase just in case Drizzle didn't catch them
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    salePrice:
      (row.salePrice || row.sale_price) != null
        ? Number(row.salePrice || row.sale_price)
        : null,
    categoryId: row.categoryId || row.category_id,
    categoryName: row.categoryName || row.category_name,
    images: Array.isArray(images) ? images : [],
    sizes: Array.isArray(sizes) ? sizes : [],
    featured: row.featured === true,
    isNew: (row.isNew || row.is_new) === true,
    createdAt: row.createdAt || row.created_at,
  };
}

router.get("/products/summary", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable);
  const categories = await db.select().from(categoriesTable);

  const onSaleCount = products.filter((p) => p.salePrice !== null).length;

  const categoryCountMap = new Map<number, number>();
  for (const p of products) {
    categoryCountMap.set(
      p.categoryId,
      (categoryCountMap.get(p.categoryId) || 0) + 1,
    );
  }

  const categoryCounts = categories.map((c) => ({
    categoryName: c.name,
    count: categoryCountMap.get(c.id) || 0,
  }));

  res.json(
    GetProductsSummaryResponse.parse({
      totalProducts: products.length,
      totalCategories: categories.length,
      onSaleCount,
      categoryCounts,
    }),
  );
});

router.get("/products/new-arrivals", async (req, res): Promise<void> => {
  const parsed = ListNewArrivalsQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 4) : 4;

  const rows = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      salePrice: productsTable.salePrice,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      images: productsTable.images,
      sizes: productsTable.sizes,
      featured: productsTable.featured,
      isNew: productsTable.isNew,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.isNew, true))
    .orderBy(desc(productsTable.createdAt))
    .limit(limit);

  res.json(ListNewArrivalsResponse.parse(rows.map(transformProduct)));
});

router.get("/products/on-sale", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      salePrice: productsTable.salePrice,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      images: productsTable.images,
      sizes: productsTable.sizes,
      featured: productsTable.featured,
      isNew: productsTable.isNew,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(sql`${productsTable.salePrice} IS NOT NULL`);

  res.json(ListOnSaleProductsResponse.parse(rows.map(transformProduct)));
});

router.get("/products", async (req, res): Promise<void> => {
  const {
    page = "1",
    limit = "10",
    search,
    categoryId,
    featured,
    isNew,
    minPrice,
    maxPrice,
    size,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
  const offset = (pageNum - 1) * limitNum;

  const conditions: any[] = [];

  if (categoryId) {
    conditions.push(
      eq(productsTable.categoryId, parseInt(categoryId as string, 10)),
    );
  }
  if (featured !== undefined) {
    conditions.push(eq(productsTable.featured, featured === "true"));
  }
  if (isNew !== undefined) {
    conditions.push(eq(productsTable.isNew, isNew === "true"));
  }
  if (minPrice !== undefined) {
    conditions.push(gte(productsTable.price, String(minPrice)));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(productsTable.price, String(maxPrice)));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderColumn: any = productsTable.createdAt;
  let orderDir: "asc" | "desc" = (sortOrder as "asc" | "desc") || "desc";

  if (sortBy === "name") {
    orderColumn = productsTable.name;
  } else if (sortBy === "price") {
    orderColumn = productsTable.price;
  }

  const baseQuery = db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      salePrice: productsTable.salePrice,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      images: productsTable.images,
      sizes: productsTable.sizes,
      featured: productsTable.featured,
      isNew: productsTable.isNew,
      createdAt: productsTable.createdAt,
      stockQuantity: productsTable.stockQuantity,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(whereClause);

  const [rows, countResult] = await Promise.all([
    orderDir === "desc"
      ? baseQuery.orderBy(desc(orderColumn)).limit(limitNum).offset(offset)
      : baseQuery.orderBy(orderColumn).limit(limitNum).offset(offset),
    db.select({ count: drizzleCount() }).from(productsTable).where(whereClause),
  ]);

  let filtered = rows;
  if (size) {
    filtered = rows.filter((r: any) => {
      const sizes = r.sizes as string[];
      return sizes.includes(size as string);
    });
  }

  if (search && typeof search === "string" && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    filtered = filtered.filter((r: any) =>
      r.name.toLowerCase().includes(searchLower),
    );
  }

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limitNum);

  res.json({
    data: filtered.map(transformProduct),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  });
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      salePrice: productsTable.salePrice,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      images: productsTable.images,
      sizes: productsTable.sizes,
      featured: productsTable.featured,
      isNew: productsTable.isNew,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(GetProductResponse.parse(transformProduct(row)));
});

// CREATE - Add new product
router.post("/products", async (req, res): Promise<void> => {
  const body = req.body as CreateProductBody;

  if (!body.name || !body.description || !body.price || !body.categoryId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [newProduct] = await db
    .insert(productsTable)
    .values({
      name: body.name,
      description: body.description,
      price: body.price,
      salePrice: body.salePrice ?? null,
      categoryId: body.categoryId,
      images: body.images ?? [],
      sizes: body.sizes ?? [],
      featured: body.featured ?? false,
      isNew: body.isNew ?? false,
      stockQuantity: body.stockQuantity ?? 0,
    })
    .returning();

  res.status(201).json(transformProduct(newProduct));
});

// UPDATE - Edit product
router.put("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = req.body as Partial<UpdateProductBody>;
  const updateData: Record<string, unknown> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.price !== undefined) updateData.price = body.price;
  if (body.salePrice !== undefined) updateData.salePrice = body.salePrice;
  if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
  if (body.images !== undefined) updateData.images = body.images;
  if (body.sizes !== undefined) updateData.sizes = body.sizes;
  if (body.featured !== undefined) updateData.featured = body.featured;
  if (body.isNew !== undefined) updateData.isNew = body.isNew;
  if (body.stockQuantity !== undefined)
    updateData.stockQuantity = body.stockQuantity;

  const [updated] = await db
    .update(productsTable)
    .set(updateData)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(transformProduct(updated));
});

// DELETE - Remove product
router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({ success: true, message: "Product deleted" });
});

const routerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Tipo de archivo no válido. Solo se permiten JPEG, PNG, WebP y GIF.",
        ),
      );
    }
  },
});

const supabaseUrl =
  process.env.SUPABASE_URL || "https://pgrnovxaafrhhknsggyy.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

router.post(
  "/products/upload",
  routerUpload.single("image"),
  async (req, res): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No se proporcionó ninguna imagen" });
        return;
      }

      const { productId } = req.body;
      const folder = productId ? `products/${productId}` : "products/temp";
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        res
          .status(500)
          .json({ error: "Error al subir la imagen: " + error.message });
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      res.json({
        success: true,
        url: urlData.publicUrl,
        path: data.path,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ error: error.message || "Error al subir la imagen" });
    }
  },
);

router.delete("/products/upload", async (req, res): Promise<void> => {
  try {
    const { path } = req.body;
    if (!path) {
      res.status(400).json({ error: "Ruta de imagen no proporcionada" });
      return;
    }

    const { error } = await supabase.storage
      .from("product-images")
      .remove([path]);

    if (error) {
      console.error("Supabase delete error:", error);
      res.status(500).json({ error: "Error al eliminar la imagen" });
      return;
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    res
      .status(500)
      .json({ error: error.message || "Error al eliminar la imagen" });
  }
});

export default router;
