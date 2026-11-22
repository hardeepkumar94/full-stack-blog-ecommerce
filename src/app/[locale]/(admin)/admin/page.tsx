import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Full Stack Project",
};

export default async function AdminDashboardPage() {
  const [blogs, products, users, orders] = await Promise.all([
    prisma.blog.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count(),
  ]);
  const cards = [
    { label: "Blogs", count: blogs, href: "/admin/blogs" },
    { label: "Products", count: products, href: "/admin/products" },
    { label: "Users", count: users, href: "/admin/users" },
    { label: "Orders", count: orders, href: "/admin/orders" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage the content shown to signed-in members.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs transition hover:border-brand-300 dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
              {card.count}
            </p>
            <p className="mt-4 text-sm font-medium text-brand-500">
              Manage {card.label.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
