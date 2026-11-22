import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

function getOtpSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return secret;
}

export function generateOtp() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(userId: string, code: string) {
  return createHmac("sha256", getOtpSecret())
    .update(`${userId}:${code}`)
    .digest("hex");
}

export function otpMatches({
  userId,
  code,
  expectedHash,
}: {
  userId: string;
  code: string;
  expectedHash: string;
}) {
  const receivedHash = hashOtp(userId, code);
  return timingSafeEqual(
    Buffer.from(receivedHash, "hex"),
    Buffer.from(expectedHash, "hex"),
  );
}

export async function issueVerificationCode(user: {
  id: string;
  name: string;
  email: string;
}) {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.emailVerificationCode.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      codeHash: hashOtp(user.id, code),
      expiresAt,
    },
    update: {
      codeHash: hashOtp(user.id, code),
      expiresAt,
      attempts: 0,
      createdAt: new Date(),
    },
  });

  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    code,
  });
}
