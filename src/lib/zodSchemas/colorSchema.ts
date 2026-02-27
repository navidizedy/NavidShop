import { z } from "zod";

export const colorSchema = z.object({
  name: z
    .string()
    .min(1, "Color name or hex code is required")
    .max(30, "Name is too long")
    .trim(),
});

export type ColorFormData = z.infer<typeof colorSchema>;
