"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2).max(191),
  phone: z.string().trim().min(7).max(30),
  addressLine: z.string().trim().min(8).max(1000),
  city: z.string().trim().min(2).max(191),
  postalCode: z.string().trim().min(3).max(20),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

export type CheckoutResult =
  { success: true; orderNumber: string } | { success: false; message: string };

export async function placeCodOrder(input: unknown): Promise<CheckoutResult> {
  const session = await auth();
  if (!session?.user)
    return { success: false, message: "Please sign in before checkout." };

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, message: "Check your delivery details and cart." };

  const productIds = parsed.data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isPublished: true },
    select: { id: true, name: true, priceCents: true },
  });

  if (products.length !== new Set(productIds).size)
    return { success: false, message: "One or more products are unavailable." };

  const orderItems = parsed.data.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId)!;
    return {
      productId: product.id,
      productName: product.name,
      unitPriceCents: product.priceCents,
      quantity: item.quantity,
    };
  });
  const totalCents = orderItems.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );
  const orderNumber = `CC-${Date.now().toString(36).toUpperCase()}`;

  await prisma.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      totalCents,
      customerName: parsed.data.customerName,
      phone: parsed.data.phone,
      addressLine: parsed.data.addressLine,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      items: { create: orderItems },
    },
  });

  return { success: true, orderNumber };
}
