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
  title: z.string().trim().min(3, "Blog title must contain at least 3 characters.").max(191),
  excerpt: z.string().trim().min(10, "Blog excerpt must contain at least 10 characters.").max(1000),
  content: z.string().trim().min(20, "Blog content must contain at least 20 characters."),
  imageUrl: optionalUrl,
});

const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must contain at least 2 characters.").max(191),
  description: z.string().trim().min(10, "Product description must contain at least 10 characters.").max(5000),
  price: z.coerce.number().positive("Product price must be greater than zero.").max(1000000),
  imageUrl: optionalUrl,
});

async function requireAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Administrator access is required.");
  }

  return session.user;
}

export interface ContentActionState {
  success: boolean;
  message: string;
}

function actionError(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Check the form fields and try again.";
  }

  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export async function createBlog(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  try {
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
    return { success: true, message: "Blog published successfully." };
  } catch (error) {
    return { success: false, message: actionError(error) };
  }
}

export async function createProduct(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  try {
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
    return { success: true, message: "Product published successfully." };
  } catch (error) {
    return { success: false, message: actionError(error) };
  }
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

export async function changeOrderStatus(formData: FormData) {
  await requireAdmin();
  const input = z
    .object({
      orderId: z.string().min(1),
      status: z.enum([
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ]),
    })
    .parse(Object.fromEntries(formData));

  await prisma.order.update({
    where: { id: input.orderId },
    data: { status: input.status },
  });
  revalidatePath("/admin/orders");
  revalidatePath("/dashboard");
}
