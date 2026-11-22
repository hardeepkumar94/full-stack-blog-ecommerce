"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || z.url().safeParse(value).success, {
    message: "Enter a valid image URL.",
  });

const blogSchema = z.object({
  title: z.string().trim().min(3).max(191),
  excerpt: z.string().trim().min(10).max(1000),
  content: z.string().trim().min(20),
  imageUrl: optionalUrl,
});

const productSchema = z.object({
  name: z.string().trim().min(2).max(191),
  description: z.string().trim().min(10).max(5000),
  price: z.coerce.number().positive().max(1000000),
  imageUrl: optionalUrl,
});

async function requireAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Administrator access is required.");
  }

  return session.user;
}

export async function createBlog(formData: FormData) {
  const admin = await requireAdmin();
  const input = blogSchema.parse(Object.fromEntries(formData));

  await prisma.blog.create({
    data: {
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      imageUrl: input.imageUrl || null,
      authorId: admin.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/blogs");
}

export async function createProduct(formData: FormData) {
  const admin = await requireAdmin();
  const input = productSchema.parse(Object.fromEntries(formData));

  await prisma.product.create({
    data: {
      name: input.name,
      description: input.description,
      priceCents: Math.round(input.price * 100),
      imageUrl: input.imageUrl || null,
      authorId: admin.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function changeUserRole(formData: FormData) {
  const admin = await requireAdmin();
  const input = z
    .object({
      userId: z.string().min(1),
      role: z.enum(["USER", "ADMIN"]),
    })
    .parse(Object.fromEntries(formData));

  if (input.userId === admin.id) {
    throw new Error("You cannot change your own administrator role.");
  }

  await prisma.user.update({
    where: { id: input.userId },
    data: { role: input.role },
  });

  revalidatePath("/admin/users");
}
