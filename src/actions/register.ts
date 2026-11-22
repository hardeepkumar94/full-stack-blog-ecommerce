"use server";

import { Prisma } from "@/generated/prisma/client";
import { issueVerificationCode } from "@/lib/auth/email-verification";
import { hashPassword } from "@/lib/auth/password";
import {
  signUpSchema,
  type SignUpFormData,
} from "@/lib/auth/validation";
import { prisma } from "@/lib/prisma";

export type RegisterResult =
  | { success: true; message: string; email: string }
  | { success: false; message: string; field?: "email" };

export async function registerUser(
  input: SignUpFormData,
): Promise<RegisterResult> {
  const parsed = signUpSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form and try again.",
    };
  }

  const { fname, lname, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerifiedAt: true,
    },
  });

  if (existingUser) {
    if (!existingUser.emailVerifiedAt) {
      await issueVerificationCode(existingUser);

      return {
        success: true,
        message: "We sent a new verification code to your email.",
        email,
      };
    }

    return {
      success: false,
      message: "An account already exists for this email address.",
      field: "email",
    };
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        name: `${fname} ${lname}`,
        email,
        passwordHash,
      },
    });

    await issueVerificationCode(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "An account already exists for this email address.",
        field: "email",
      };
    }

    console.error("Registration failed", error);

    return {
      success: false,
      message: "We could not create your account. Please try again.",
    };
  }

  return {
    success: true,
    message: "Your account was created. Check your email for the code.",
    email,
  };
}
