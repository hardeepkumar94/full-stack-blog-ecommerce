import { auth, signOut } from "@/auth";
import { Link, redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

const statusLabels = {
  PLACED: "Order placed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

export default async function MemberDashboard({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ordered?: string }>;
}) {
  const [session, { locale }, query] = await Promise.all([
    auth(),
    params,
    searchParams,
  ]);
  const user = session?.user;
  if (!user) redirect({ href: "/signin", locale: locale as Locale });
  const orders = await prisma.order.findMany({
    where: { userId: user!.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-brand-500">Member dashboard</p>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Welcome, {user!.name}
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white"
            >
              Cart
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700">
                Sign out
              </button>
            </form>
          </div>
        </div>
        {query.ordered && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            Order {query.ordered} was placed successfully. Payment is due on
            delivery.
          </div>
        )}
        <section>
          <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
            Recent orders
          </h2>
          {orders.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-gray-500 shadow-theme-xs dark:bg-gray-800">
              You have no orders yet.
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl bg-white p-6 shadow-theme-xs dark:bg-gray-800"
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {order.createdAt.toLocaleDateString()} · Cash on
                        Delivery
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-950/40">
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                    {order.items.map((item) => (
                      <p
                        key={item.id}
                        className="text-sm text-gray-600 dark:text-gray-300"
                      >
                        {item.productName} × {item.quantity}
                      </p>
                    ))}
                    <p className="mt-3 font-semibold text-gray-900 dark:text-white">
                      Total: ${(order.totalCents / 100).toFixed(2)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
