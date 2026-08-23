"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { KeyboardArrowDown } from "relume-icons";
import { logout } from "@/app/admin/login/actions";
import { SubmitButton } from "@/components/admin/submit-button";

type NavItem = { href: string; label: string; exact?: boolean };
type NavGroup = { key: string; label: string; items: NavItem[] };

const ROOT_ITEM: NavItem = { href: "/admin", label: "Dashboard", exact: true };

// "Home page" links straight to the Home page's own section editor, which
// now also surfaces Hero slides from there — Hero isn't its own sidebar
// destination anymore, it's presented as part of managing the home page.
const NAV_GROUPS: NavGroup[] = [
  {
    key: "pages",
    label: "Pages",
    items: [
      { href: "/admin/pages/home", label: "Home page" },
      { href: "/admin/pages/about", label: "About" },
      { href: "/admin/pages/team", label: "Team" },
      { href: "/admin/pages/our-work", label: "Our Work" },
      { href: "/admin/pages/partners", label: "Partners" },
      { href: "/admin/pages/vision-and-mission", label: "Vision and Mission" },
      {
        href: "/admin/pages/signatory-countries",
        label: "Signatory Countries",
      },
      { href: "/admin/pages/privacy-policy", label: "Privacy Policy" },
      { href: "/admin/pages/terms-of-service", label: "Terms of Service" },
      { href: "/admin/pages/cookie-settings", label: "Cookie Settings" },
    ],
  },
  {
    key: "content",
    label: "Content",
    items: [
      { href: "/admin/team", label: "Team members" },
      { href: "/admin/blog", label: "Blog / News" },
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/partners", label: "Partners & Countries" },
    ],
  },
  {
    key: "work-with-us",
    label: "Work With Us",
    items: [{ href: "/admin/work-with-us", label: "Work With Us" }],
  },
  {
    key: "resources",
    label: "Resources",
    items: [
      { href: "/admin/publications", label: "Publications" },
      { href: "/admin/media", label: "Media" },
    ],
  },
  {
    key: "site",
    label: "Site",
    items: [
      { href: "/admin/contact", label: "Contact methods" },
      { href: "/admin/contact-messages", label: "Contact messages" },
      { href: "/admin/subscribers", label: "Subscribers" },
      { href: "/admin/navigation", label: "Navigation" },
      { href: "/admin/settings", label: "Site settings" },
    ],
  },
];

function isItemActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`rounded-button px-3 py-2 text-small font-medium transition-colors ${
        active
          ? "bg-mountain-meadow-lightest text-mountain-meadow-darker"
          : "text-neutral-dark hover:bg-neutral-lightest"
      }`}
    >
      {item.label}
    </Link>
  );
}

export function AdminSidebar({
  email,
  name,
  logoDark,
}: {
  email: string;
  name: string;
  logoDark: string;
}) {
  const pathname = usePathname();

  // A group starts open if the current page is inside it, so a direct link
  // (e.g. bookmarking /admin/blog) doesn't land on a collapsed submenu.
  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () =>
      new Set(
        NAV_GROUPS.filter((g) =>
          g.items.some((i) => isItemActive(pathname, i)),
        ).map((g) => g.key),
      ),
  );

  function toggleGroup(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex h-screen w-64 flex-none flex-col border-r border-neutral-lighter bg-white">
      <div className="flex-none border-b border-neutral-lighter p-6">
        <img src={logoDark} alt="CECECO" className="h-7 w-auto" />
        <p className="mt-2 text-tiny font-semibold tracking-wide text-neutral uppercase">
          Admin panel
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        <NavLink item={ROOT_ITEM} active={isItemActive(pathname, ROOT_ITEM)} />

        {NAV_GROUPS.map((group) => {
          const open = openKeys.has(group.key);
          const groupActive = group.items.some((i) =>
            isItemActive(pathname, i),
          );
          return (
            <div key={group.key} className="mt-1 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.key)}
                className={`flex items-center justify-between rounded-button px-3 py-2 text-small font-semibold transition-colors ${
                  groupActive
                    ? "text-mountain-meadow-darker"
                    : "text-neutral-darkest hover:bg-neutral-lightest"
                }`}
              >
                {group.label}
                <KeyboardArrowDown
                  className={`size-4 text-neutral transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="flex flex-col gap-1 border-l border-neutral-lighter pl-3">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={isItemActive(pathname, item)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="flex-none border-t border-neutral-lighter p-4">
        <p className="truncate text-small font-semibold text-neutral-darkest">
          {name || "Admin"}
        </p>
        <p className="truncate text-tiny text-neutral">{email}</p>
        <form action={logout} className="mt-3">
          <SubmitButton
            pendingText="Signing out..."
            className="w-full border border-neutral-lighter bg-transparent text-neutral-darkest hover:bg-neutral-lightest"
          >
            Sign out
          </SubmitButton>
        </form>
      </div>
    </aside>
  );
}
