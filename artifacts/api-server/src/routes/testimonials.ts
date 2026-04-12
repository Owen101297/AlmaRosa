import { Router, type IRouter } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListTestimonialsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/testimonials", async (_req, res): Promise<void> => {
  const testimonials = await db.select().from(testimonialsTable);
  const result = testimonials.map((t) => ({
    ...t,
    avatar: t.avatar ?? "",
  }));
  res.json(ListTestimonialsResponse.parse(result));
});

router.put("/testimonials/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid testimonial ID" });
    return;
  }
  const { isActive, name, comment, rating, avatar } = req.body;
  const updateData: Record<string, unknown> = {};
  if (isActive !== undefined) updateData.isActive = isActive;
  if (name) updateData.name = name;
  if (comment) updateData.comment = comment;
  if (rating) updateData.rating = rating;
  if (avatar !== undefined) updateData.avatar = avatar;

  const [updated] = await db
    .update(testimonialsTable)
    .set(updateData)
    .where(eq(testimonialsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }
  res.json(updated);
});

router.delete("/testimonials/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid testimonial ID" });
    return;
  }

  const [deleted] = await db
    .delete(testimonialsTable)
    .where(eq(testimonialsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }
  res.json({ success: true, message: "Testimonial deleted" });
});

export default router;
