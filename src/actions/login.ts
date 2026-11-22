"use server";

import { signIn } from "@/auth";
import { signInSchema, type SignInFormData } from "@/lib/auth/validation";
import { AuthError } from "next-auth";

export type LoginResult =
  { success: true } | { success: false; message: string };

export async function loginUser(input: SignInFormData): Promise<LoginResult> {
  const parsed = signInSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address and password.",
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "The email or password is incorrect.",
      };
    }

    throw error;
  }

  return { success: true };
}
