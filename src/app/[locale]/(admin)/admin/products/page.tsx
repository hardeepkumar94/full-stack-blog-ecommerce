import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import ContentForm from "@/components/admin/content-form";
import { createProduct } from "@/lib/admin/actions";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products | Admin" };

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageBreadcrumb pageTitle="Products" />
      <div className="grid gap-6 xl:grid-cols-2">
        <ComponentCard title="Add new product">
          <ContentForm
            action={createProduct}
            submitLabel="Publish product"
            fields={[
              { label: "Name", name: "name", placeholder: "Product name" },
              { label: "Description", name: "description", type: "textarea", placeholder: "Describe the product" },
              { label: "Price", name: "price", type: "number", placeholder: "49.99" },
              { label: "Image URL (optional)", name: "imageUrl", type: "url", placeholder: "https://example.com/product.jpg" },
            ]}
          />
        </ComponentCard>
        <ComponentCard title={`Published products (${products.length})`}>
          <div className="space-y-4">
            {products.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400">No products yet.</p> : products.map((product) => (
              <article key={product.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3><p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{product.description}</p></div>
                  <span className="font-semibold text-brand-500">${(product.priceCents / 100).toFixed(2)}</span>
                </div>
              </article>
            ))}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
