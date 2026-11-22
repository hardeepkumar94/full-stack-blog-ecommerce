import { z } from "zod";

export const signUpSchema = z
  .object({
    fname: z.string().trim().min(1, "First name is required").max(50),
    lname: z.string().trim().min(1, "Last name is required").max(50),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be no more than 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((accepted) => accepted, {
      message: "You must agree to the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z.string().min(1, "Password is required").max(128),
  keepLoggedIn: z.boolean().optional(),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
