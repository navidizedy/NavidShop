import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .trim(),
  categories: z.array(z.string()).min(1, "Select at least one category"),

  details: z.string().optional().or(z.literal("")),
});

export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
