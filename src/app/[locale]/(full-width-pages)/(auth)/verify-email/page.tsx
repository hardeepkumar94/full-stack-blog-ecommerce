import VerifyEmail from "@/components/others/auth/verify-email";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | Full Stack Project",
  description: "Verify your email address with a one-time code.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return <VerifyEmail initialEmail={email} />;
}
