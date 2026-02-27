import { z } from "zod";

export const sizeSchema = z.object({
  name: z
    .string()
    .min(1, "Size name is required (e.g., XL, 42)")
    .max(20, "Size name is too long")
    .trim(),
});

export type SizeFormData = z.infer<typeof sizeSchema>;
