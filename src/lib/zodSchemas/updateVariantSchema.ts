import { z } from "zod";

export const updateVariantSchema = z.object({
  count: z.coerce.number().min(0, "Stock cannot be negative"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  oldPrice: z.coerce
    .number()
    .min(0, "Old Price cannot be negative")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  discount: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
});

export type UpdateVariantFormData = z.infer<typeof updateVariantSchema>;
