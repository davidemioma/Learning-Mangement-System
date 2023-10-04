import { z } from "zod";

export const accessSchema = z.object({
  isFree: z.boolean().default(false),
});

export type accessData = z.infer<typeof accessSchema>;
