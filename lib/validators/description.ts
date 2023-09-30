import { z } from "zod";

export const descriptionSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export type descriptionData = z.infer<typeof descriptionSchema>;
