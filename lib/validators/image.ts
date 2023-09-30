import { z } from "zod";

export const imageSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export type imageData = z.infer<typeof imageSchema>;
