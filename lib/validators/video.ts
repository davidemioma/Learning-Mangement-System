import { z } from "zod";

export const videoSchema = z.object({
  videoUrl: z.string().min(1),
});

export type videoData = z.infer<typeof videoSchema>;
