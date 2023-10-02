import { z } from "zod";

export const attachmentSchema = z.object({
  url: z.string().min(1),
});

export type attachmentData = z.infer<typeof attachmentSchema>;
