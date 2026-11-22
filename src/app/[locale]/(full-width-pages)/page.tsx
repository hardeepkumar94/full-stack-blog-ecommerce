import type { Metadata } from "next";
import { auth, signOut } from "@/auth";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Welcome | Full Stack Project",
  description: "Sign in or create an account to continue.",
};

export default async function HomePage() {
  const session = await auth();
  const [blogs, products] = session?.user
    ? await Promise.all([
        prisma.blog.findMany({
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.findMany({
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        }),
      ])
    : [[], []];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white shadow-theme-md dark:bg-gray-800">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <section>
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-brand-500 uppercase">
              Full Stack Project
            </p>
            <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              A simple place for ideas and products.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300">
              Sign in or create an account to continue. Blog posts and products
              will appear here as we build the project.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 p-6 sm:p-8 dark:border-gray-700">
            {session?.user ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Welcome, {session.user.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  You are signed in as {session.user.email}.
                </p>
                <div className="mt-7 flex flex-col gap-3">
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                    >
                      Open admin dashboard
                    </Link>
                  )}
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Get started
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Choose an option to continue to the account screen.
                </p>
                <div className="mt-7 flex flex-col gap-3">
                  <Link
                    href="/signin"
                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex min-h-12 items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Create an account
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
      {session?.user && (
        <div className="mx-auto mt-10 w-full max-w-5xl space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Latest products
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No products have been published yet.
                </p>
              ) : (
                products.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-2xl bg-white p-6 shadow-theme-xs dark:bg-gray-800"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {product.description}
                    </p>
                    <p className="mt-4 font-semibold text-brand-500">
                      ${(product.priceCents / 100).toFixed(2)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Latest blogs
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {blogs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No blogs have been published yet.
                </p>
              ) : (
                blogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="rounded-2xl bg-white p-6 shadow-theme-xs dark:bg-gray-800"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {blog.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {blog.excerpt}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
