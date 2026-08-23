"use client";

import { usePathname } from "next/navigation";

import { NAV_MAIN, NAV_SECONDARY } from "@/components/admin/app-sidebar";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { Separator } from "@/components/admin/ui/separator";
import { SidebarTrigger } from "@/components/admin/ui/sidebar";

function isActive(pathname: string, url: string, exact?: boolean) {
  return exact ? pathname === url : pathname.startsWith(url);
}

function currentTitle(pathname: string) {
  for (const item of NAV_MAIN) {
    if (item.items?.length) {
      const sub = item.items.find((s) => isActive(pathname, s.url));
      if (sub) return sub.title;
      if (isActive(pathname, item.url)) return item.title;
    } else if (isActive(pathname, item.url, item.exact)) {
      return item.title;
    }
  }
  const secondary = NAV_SECONDARY.find((i) => isActive(pathname, i.url));
  if (secondary) return secondary.title;
  return "Admin";
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="flex-1 text-base font-medium">{currentTitle(pathname)}</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
