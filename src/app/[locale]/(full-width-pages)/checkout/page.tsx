import { auth } from "@/auth";
import CheckoutPage from "@/components/shop/checkout-page";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function CheckoutRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [session, { locale }] = await Promise.all([auth(), params]);
  const user = session?.user;
  if (!user) redirect({ href: "/signin", locale: locale as Locale });
  return <CheckoutPage defaultName={user!.name ?? ""} />;
}
