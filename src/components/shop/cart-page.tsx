"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { type CartItem, readCart, writeCart } from "@/lib/cart";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(readCart()), []);

  const updateQuantity = (productId: string, quantity: number) => {
    const next = items
      .map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      )
      .filter((item) => item.quantity > 0);
    setItems(next);
    writeCart(next);
  };
  const total = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Your cart
          </h1>
          <Link href="/" className="text-sm font-medium text-brand-500">
            Continue shopping
          </Link>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-theme-xs dark:bg-gray-800">
          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5 dark:border-gray-700"
                >
                  <div>
                    <h2 className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      ${(item.priceCents / 100).toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
              <Button
                nativeButton={false}
                render={<Link href="/checkout" />}
                className="w-full"
                size="lg"
              >
                Proceed to checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
