import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const configuredDatabaseUrl = databaseUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapterUrl = new URL(
    configuredDatabaseUrl.replace(/^mysql:/, "mariadb:"),
  );
  adapterUrl.searchParams.set("connectionLimit", "1");
  adapterUrl.searchParams.set("connectTimeout", "10000");
  adapterUrl.searchParams.set("acquireTimeout", "20000");
  adapterUrl.searchParams.set("idleTimeout", "1800");

  const adapter = new PrismaMariaDb(adapterUrl.toString());
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
