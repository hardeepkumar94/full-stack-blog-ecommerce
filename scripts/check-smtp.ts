import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { createEmailTransport } = await import("../src/lib/email");
  const transport = createEmailTransport();

  await transport.verify();
  await transport.close();

  console.log("SMTP connection and authentication succeeded.");
}

main().catch((error: unknown) => {
  console.error("SMTP verification failed", error);
  process.exitCode = 1;
});
