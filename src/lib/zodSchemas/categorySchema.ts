import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .trim(),
  image: z.any().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
