"use client";

import { SidebarHeader } from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";

interface AppSidebarHeaderProps {
  showContent: boolean;
}

export default function AppSidebarHeader({
  showContent,
}: AppSidebarHeaderProps) {
  return (
    <SidebarHeader className="px-5 pt-5 pb-8">
      <Link
        href="/"
        className={cn(
          "flex items-center",
          !showContent ? "justify-center" : "justify-start",
        )}
      >
        <span
          className={cn(
            "font-semibold text-gray-900 dark:text-white",
            showContent ? "text-xl" : "text-sm",
          )}
        >
          {showContent ? "CoreiCode Team" : "CT"}
        </span>
      </Link>
    </SidebarHeader>
  );
}
