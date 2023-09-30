import { z } from "zod";

export const categorySchema = z.object({
  categoryId: z.string().min(1),
});

export type categoryData = z.infer<typeof categorySchema>;
