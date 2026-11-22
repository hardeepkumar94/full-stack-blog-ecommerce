export const CART_STORAGE_KEY = "coreicode-cart";

export interface CartItem {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY) ?? "[]",
    ) as CartItem[];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}
