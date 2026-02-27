import { z } from "zod";

export const VariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  count: z.coerce.number().int().min(1, "Stock must be at least 1"),
  price: z.coerce.number().positive("Price must be greater than 0"),

  oldPrice: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().min(0).optional(),
  ),
  discount: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().min(0).max(100).optional(),
  ),
});

export const addProductSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .trim(),
  details: z.string().min(1, "Product details are required").trim(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  images: z
    .any()
    .refine(
      (files) =>
        files instanceof FileList ? files.length > 0 : files?.length > 0,
      "Please select at least one image",
    ),
  variants: z
    .array(VariantSchema)
    .min(1, "Add at least one variant (color, size, count, price)"),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;
