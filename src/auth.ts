import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import type { UserRole } from "@/generated/prisma/client";
import { verifyPassword } from "@/lib/auth/password";
import { signInSchema } from "@/lib/auth/validation";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) {
          return null;
        }

        if (!user.emailVerifiedAt) {
          return null;
        }

        const passwordIsValid = await verifyPassword(
          user.passwordHash,
          parsed.data.password,
        );

        if (!passwordIsValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as UserRole;
      return session;
    },
  },
});
