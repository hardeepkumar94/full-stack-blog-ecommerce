import CartPage from "@/components/shop/cart-page";
import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function CartRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [session, { locale }] = await Promise.all([auth(), params]);
  if (!session?.user) redirect({ href: "/signin", locale: locale as Locale });
  return <CartPage />;
}
