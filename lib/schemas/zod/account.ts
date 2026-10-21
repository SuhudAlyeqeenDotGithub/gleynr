import { z } from "zod";

export const accountSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string().min(3).max(30),
  createdAt: z.date(),
});

export type Account = z.infer<typeof accountSchema>;