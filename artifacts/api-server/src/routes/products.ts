import { Router, type IRouter } from "express";
import { eq, and, gte, lte, desc, sql, count as drizzleCount } from "drizzle-orm";
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

const router: IRouter = Router();

function transformProduct(row: Record<string, unknown>) {
  return {
    ...row,
    price: Number(row.price),
    salePrice: row.salePrice != null ? Number(row.salePrice) : null,
  };
}

router.get("/products/summary", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable);
  const categories = await db.select().from(categoriesTable);

  const onSaleCount = products.filter((p) => p.salePrice !== null).length;

  const categoryCountMap = new Map<number, number>();
  for (const p of products) {
    categoryCountMap.set(p.categoryId, (categoryCountMap.get(p.categoryId) || 0) + 1);
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
  const parsed = ListProductsQueryParams.safeParse(req.query);
  const params = parsed.success ? parsed.data : {};

  const conditions = [];

  if (params.categoryId) {
    conditions.push(eq(productsTable.categoryId, params.categoryId));
  }
  if (params.featured !== undefined) {
    conditions.push(eq(productsTable.featured, params.featured));
  }
  if (params.minPrice !== undefined) {
    conditions.push(gte(productsTable.price, String(params.minPrice)));
  }
  if (params.maxPrice !== undefined) {
    conditions.push(lte(productsTable.price, String(params.maxPrice)));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

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
    .where(whereClause)
    .orderBy(desc(productsTable.createdAt));

  let filtered = rows;
  if (params.size) {
    filtered = rows.filter((r) => {
      const sizes = r.sizes as string[];
      return sizes.includes(params.size!);
    });
  }

  res.json(ListProductsResponse.parse(filtered.map(transformProduct)));
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

export default router;
