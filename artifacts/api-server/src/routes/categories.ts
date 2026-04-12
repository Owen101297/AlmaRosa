import { Router, type IRouter } from "express";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { eq, sql, count as drizzleCount } from "drizzle-orm";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

interface CreateCategoryBody {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface UpdateCategoryBody extends Partial<CreateCategoryBody> {
  id: number;
}

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
    image: c.image ?? "",
    productCount: countMap.get(c.id) || 0,
  }));

  res.json(ListCategoriesResponse.parse(result));
});

// CREATE - Add new category
router.post("/categories", async (req, res): Promise<void> => {
  const body = req.body as CreateCategoryBody;

  if (!body.name || !body.slug) {
    res.status(400).json({ error: "Name and slug are required" });
    return;
  }

  const [newCategory] = await db
    .insert(categoriesTable)
    .values({
      name: body.name,
      slug: body.slug,
      description: body.description || "",
      image: body.image || "",
    })
    .returning();

  res.status(201).json(newCategory);
});

// UPDATE - Edit category
router.put("/categories/:id", async (req, res): Promise<void> => {
  const params = req.params as { id: string };
  const id = parseInt(params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid category ID" });
    return;
  }

  const body = req.body as Partial<UpdateCategoryBody>;
  const updateData: Record<string, unknown> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.image !== undefined) updateData.image = body.image;

  const [updated] = await db
    .update(categoriesTable)
    .set(updateData)
    .where(eq(categoriesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.json(updated);
});

// DELETE - Remove category
router.delete("/categories/:id", async (req, res): Promise<void> => {
  const params = req.params as { id: string };
  const id = parseInt(params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid category ID" });
    return;
  }

  const [deleted] = await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.json({ success: true, message: "Category deleted" });
});

export default router;
