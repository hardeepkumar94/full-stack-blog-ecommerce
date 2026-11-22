"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { CART_STORAGE_KEY, type CartItem, readCart } from "@/lib/cart";
import { placeCodOrder, type CheckoutResult } from "@/lib/orders/actions";
import { useEffect, useState } from "react";

export default function CheckoutPage({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [pending, setPending] = useState(false);
  useEffect(() => setItems(readCart()), []);
  const total = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );

  const submit = async (formData: FormData) => {
    setPending(true);
    setResult(null);
    const response = await placeCodOrder({
      customerName: formData.get("customerName"),
      phone: formData.get("phone"),
      addressLine: formData.get("addressLine"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
      items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    });
    setPending(false);
    setResult(response);
    if (response.success) {
      localStorage.removeItem(CART_STORAGE_KEY);
      router.push(`/dashboard?ordered=${response.orderNumber}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-semibold text-gray-900 dark:text-white">
          Checkout
        </h1>
        <div className="rounded-2xl bg-white p-6 shadow-theme-xs dark:bg-gray-800">
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            <strong>Payment method:</strong> Cash on Delivery only. Pay when
            your order arrives.
          </div>
          {result && !result.success && (
            <Alert variant="destructive">
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <form action={submit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Full name
                </span>
                <Input
                  name="customerName"
                  defaultValue={defaultName}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Phone</span>
                <Input name="phone" type="tel" required />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Delivery address
                </span>
                <Textarea name="addressLine" required />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-medium">City</span>
                  <Input name="city" required />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-medium">
                    Postal code
                  </span>
                  <Input name="postalCode" required />
                </label>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-5 text-lg font-semibold dark:border-gray-700">
                <span>Order total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={pending}
              >
                {pending ? "Placing order..." : "Place Cash on Delivery order"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
