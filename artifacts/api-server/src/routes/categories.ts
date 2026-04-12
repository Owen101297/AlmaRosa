import { Router, type IRouter } from "express";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { eq, sql, count as drizzleCount } from "drizzle-orm";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const categories = await db.select().from(categoriesTable);
  const products = await db.select().from(productsTable);

  const countMap = new Map<number, number>();
  for (const p of products) {
    countMap.set(p.categoryId, (countMap.get(p.categoryId) || 0) + 1);
  }

  const result = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image,
    productCount: countMap.get(c.id) || 0,
  }));

  res.json(ListCategoriesResponse.parse(result));
});

export default router;
