import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "At least 2 characters")
      .nonempty("Name is required"),
    email: z
      .email({ message: "Invalid email address" })
      .nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters")
      .nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
