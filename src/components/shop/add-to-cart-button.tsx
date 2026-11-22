"use client";

import { Button } from "@/components/ui/button";
import { readCart, writeCart } from "@/lib/cart";
import { useState } from "react";

interface AddToCartButtonProps {
  product: { id: string; name: string; priceCents: number };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cart = readCart();
    const existing = cart.find((item) => item.productId === product.id);

    if (existing) existing.quantity += 1;
    else
      cart.push({
        productId: product.id,
        name: product.name,
        priceCents: product.priceCents,
        quantity: 1,
      });

    writeCart(cart);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Button type="button" size="sm" onClick={addToCart}>
      {added ? "Added" : "Add to cart"}
    </Button>
  );
}
