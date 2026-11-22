import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import ContentForm from "@/components/admin/content-form";
import { createBlog } from "@/lib/admin/actions";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blogs | Admin" };

export default async function BlogsPage() {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageBreadcrumb pageTitle="Blogs" />
      <div className="grid gap-6 xl:grid-cols-2">
        <ComponentCard title="Add new blog">
          <ContentForm
            action={createBlog}
            submitLabel="Publish blog"
            fields={[
              { label: "Title", name: "title", placeholder: "My first blog" },
              { label: "Excerpt", name: "excerpt", type: "textarea", placeholder: "A short summary for the homepage" },
              { label: "Content", name: "content", type: "textarea", placeholder: "Write the complete article" },
              { label: "Image URL (optional)", name: "imageUrl", type: "url", placeholder: "https://example.com/image.jpg" },
            ]}
          />
        </ComponentCard>
        <ComponentCard title={`Published blogs (${blogs.length})`}>
          <div className="space-y-4">
            {blogs.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400">No blogs yet.</p> : blogs.map((blog) => (
              <article key={blog.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">{blog.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{blog.excerpt}</p>
              </article>
            ))}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
