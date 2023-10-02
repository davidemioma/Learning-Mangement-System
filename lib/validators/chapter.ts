import { z } from "zod";

export const chapterSchema = z.object({
  title: z.string().min(1),
});

export type chapterData = z.infer<typeof chapterSchema>;
