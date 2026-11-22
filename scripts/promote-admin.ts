import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env.local" });

const emailSchema = z.string().trim().email().toLowerCase();

async function main() {
  const { prisma } = await import("../src/lib/prisma");
  const argument = process.argv[2];

  try {
    if (argument === "--list") {
      const users = await prisma.user.findMany({
        select: {
          name: true,
          email: true,
          role: true,
          emailVerifiedAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      });

      if (users.length === 0) {
        console.log("No registered users were found.");
      } else {
        console.table(users);
      }

      process.exitCode = 0;
    } else {
      const parsedEmail = emailSchema.safeParse(argument);

      if (!parsedEmail.success) {
        console.error(
          "Usage: npm run admin:promote -- user@example.com\n" +
            "List candidates: npm run admin:promote -- --list",
        );
        process.exitCode = 1;
      } else {
        const result = await prisma.user.updateMany({
          where: { email: parsedEmail.data },
          data: { role: "ADMIN" },
        });

        if (result.count === 0) {
          console.error(`No user was found for ${parsedEmail.data}.`);
          process.exitCode = 1;
        } else {
          console.log(`${parsedEmail.data} is now an administrator.`);
          process.exitCode = 0;
        }
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Admin promotion failed", error);
  process.exitCode = 1;
});
