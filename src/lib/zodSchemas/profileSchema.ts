import { z } from "zod";

export const profileSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long")
      .trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .trim(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .superRefine(({ oldPassword, newPassword }, ctx) => {
    if (
      newPassword &&
      newPassword.length > 0 &&
      (!oldPassword || oldPassword.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current password is required to set a new one",
        path: ["oldPassword"],
      });
    }

    if (newPassword && newPassword.length > 0 && newPassword.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New password must be at least 6 characters",
        path: ["newPassword"],
      });
    }
  });
