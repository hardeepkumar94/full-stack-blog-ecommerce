import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { changeOrderStatus } from "@/lib/admin/actions";
import { prisma } from "@/lib/prisma";

const statuses = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <PageBreadcrumb pageTitle="Orders" />
      <ComponentCard title={`Orders (${orders.length})`}>
        <div className="space-y-5">
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.user.email} · $
                      {(order.totalCents / 100).toFixed(2)} · COD
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {order.items
                        .map((item) => `${item.productName} × ${item.quantity}`)
                        .join(", ")}
                    </p>
                  </div>
                  <form
                    action={changeOrderStatus}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="orderId" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" size="sm">
                      Update
                    </Button>
                  </form>
                </div>
              </article>
            ))
          )}
        </div>
      </ComponentCard>
    </>
  );
}
