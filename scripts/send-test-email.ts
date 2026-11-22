import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env.local" });

async function main() {
  const recipient = z.string().email().parse(process.argv[2]);
  const { sendVerificationEmail } = await import("../src/lib/email");

  await sendVerificationEmail({
    email: recipient,
    name: "Hardeep",
    code: "123456",
  });

  console.log(`Test verification email accepted for delivery to ${recipient}.`);
}

main().catch((error: unknown) => {
  console.error("Test email failed", error);
  process.exitCode = 1;
});
