import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import AppHeader from "@/layout/app-layout/header";
import AppSidebar from "@/layout/app-layout/sidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [session, { locale }] = await Promise.all([auth(), params]);
  const user = session?.user;

  if (!user || user.role !== "ADMIN") {
    redirect({ href: "/", locale: locale as Locale });
  }

  const authorizedUser = user!;

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AppHeader user={authorizedUser} />

        <div className="p-4 mx-auto w-full max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
