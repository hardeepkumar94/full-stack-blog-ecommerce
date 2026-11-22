"use server";

import {
  issueVerificationCode,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
  otpMatches,
} from "@/lib/auth/email-verification";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const emailSchema = z.string().trim().email().toLowerCase();
const codeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/);

export type VerificationResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function verifyEmailCode({
  email,
  code,
}: {
  email: string;
  code: string;
}): Promise<VerificationResult> {
  const parsedEmail = emailSchema.safeParse(email);
  const parsedCode = codeSchema.safeParse(code);

  if (!parsedEmail.success || !parsedCode.success) {
    return { success: false, message: "Enter a valid six-digit code." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsedEmail.data },
    include: { emailVerificationCode: true },
  });

  if (!user) {
    return { success: false, message: "The verification code is invalid." };
  }

  if (user.emailVerifiedAt) {
    return { success: true, message: "Your email is already verified." };
  }

  const verification = user.emailVerificationCode;

  if (!verification || verification.expiresAt.getTime() <= Date.now()) {
    if (verification) {
      await prisma.emailVerificationCode.delete({ where: { userId: user.id } });
    }

    return {
      success: false,
      message: "This code has expired. Request a new code.",
    };
  }

  if (verification.attempts >= OTP_MAX_ATTEMPTS) {
    return {
      success: false,
      message: "Too many attempts. Request a new code.",
    };
  }

  if (
    !otpMatches({
      userId: user.id,
      code: parsedCode.data,
      expectedHash: verification.codeHash,
    })
  ) {
    await prisma.emailVerificationCode.update({
      where: { userId: user.id },
      data: { attempts: { increment: 1 } },
    });

    return { success: false, message: "The verification code is invalid." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationCode.delete({ where: { userId: user.id } }),
  ]);

  return {
    success: true,
    message: "Email verified successfully. Redirecting you to sign in...",
  };
}

export async function resendEmailCode(
  email: string,
): Promise<VerificationResult> {
  const parsedEmail = emailSchema.safeParse(email);

  if (!parsedEmail.success) {
    return { success: false, message: "Enter a valid email address." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsedEmail.data },
    include: { emailVerificationCode: true },
  });

  if (!user || user.emailVerifiedAt) {
    return {
      success: true,
      message: "If verification is required, a new code has been sent.",
    };
  }

  if (user.emailVerificationCode) {
    const ageInSeconds =
      (Date.now() - user.emailVerificationCode.createdAt.getTime()) / 1000;

    if (ageInSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
      return {
        success: false,
        message: `Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - ageInSeconds)} seconds before requesting another code.`,
      };
    }
  }

  await issueVerificationCode(user);

  return { success: true, message: "A new verification code was sent." };
}
