import { z } from "zod";

export const priceSchema = z.object({
  price: z.coerce.number(),
});

export type priceData = z.infer<typeof priceSchema>;
