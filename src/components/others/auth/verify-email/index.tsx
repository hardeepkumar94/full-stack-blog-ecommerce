"use client";

import {
  resendEmailCode,
  verifyEmailCode,
  type VerificationResult,
} from "@/actions/verify-email";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

export default function VerifyEmail({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);
    setIsSubmitting(true);

    try {
      setResult(await verifyEmailCode({ email, code }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResult(null);
    setIsResending(true);

    try {
      setResult(await resendEmailCode(email));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
            Verify your email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the six-digit code we sent to your email. It expires in 10
            minutes.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          {result && (
            <Alert variant={result.success ? "success" : "destructive"}>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <Field>
            <FieldLabel>Email address</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </Field>

          <Field>
            <FieldLabel>Verification code</FieldLabel>
            <Input
              type="text"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="text-center text-xl tracking-[0.5em]"
              required
            />
          </Field>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || code.length !== 6}
          >
            {isSubmitting ? "Verifying..." : "Verify email"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleResend}
            disabled={isResending || !email}
          >
            {isResending ? "Sending..." : "Resend code"}
          </Button>

          {result?.success && (
            <Link
              href="/signin"
              className="block text-center text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Continue to sign in
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
