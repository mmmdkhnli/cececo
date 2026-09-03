"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { KeyboardArrowDown } from "relume-icons";
import { SearchToggle } from "@/components/shared/search-toggle";
import type { NavLink } from "@/db/queries/site";

const GLASS_PANEL = "border border-white-15 bg-white/10 backdrop-blur-2xl";
const DROPDOWN_PANEL = "border border-white-15 bg-neutral-darkest/95 backdrop-blur-xl";

function useNavbarState() {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdownId, setOpenMobileDropdownId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 991px)", { initializeWithValue: false });

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleMobileDropdown = (id: number) =>
    setOpenMobileDropdownId((prev) => (prev === id ? null : id));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isMobileMenuOpen && isMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isMobile]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting one panel's UI state in response to another closing, not derivable during render
    if (!isMobileMenuOpen) setOpenMobileDropdownId(null);
  }, [isMobileMenuOpen]);

  return {
    menuRef,
    buttonRef,
    isMobile,
    isMobileMenuOpen,
    openMobileDropdownId,
    toggleMobileMenu,
    toggleMobileDropdown,
  };
}

export function NavbarClient({ links, logo }: { links: NavLink[]; logo: string }) {
  const nav = useNavbarState();

  return (
    <section className="navbar-hack fixed inset-0 bottom-auto z-999 mx-auto mt-0 mb-8 flex w-full items-center justify-center bg-transparent! px-0 lg:mt-6 lg:mx-[2%] lg:w-auto scheme-2 badge-alt alternate">
      <Card
        className={`relative flex min-h-16 w-full items-center justify-between gap-4 overflow-visible rounded-none shadow-lg shadow-neutral-darkest/20 px-5 md:min-h-18 md:px-8 lg:w-auto lg:px-6 lg:rounded-card ${GLASS_PANEL}`}
      >
        <Link href="/" className="shrink-0">
          <img src={logo} alt="CECECO" className="h-8 w-auto md:h-9" />
        </Link>

        <nav className="hidden items-center lg:ml-8 lg:flex">
          {links.map((link) =>
            link.children.length > 0 ? (
              <DesktopDropdown key={link.id} dropdown={link} />
            ) : (
              <a key={link.id} href={link.href} className="px-3 py-2 text-base">
                {link.label}
              </a>
            ),
          )}
        </nav>

        <AnimatePresence>
          {nav.isMobile && nav.isMobileMenuOpen && (
            <motion.div
              ref={nav.menuRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
              className={`absolute inset-x-0 top-full flex max-h-[70vh] flex-col overflow-y-auto border-t-0 p-5 lg:hidden scheme-4 ${DROPDOWN_PANEL}`}
            >
              {links.map((link) =>
                link.children.length === 0 ? (
                  <a
                    key={link.id}
                    href={link.href}
                    className="border-b border-white-10 py-3 text-base last:border-0"
                  >
                    {link.label}
                  </a>
                ) : (
                  <div key={link.id} className="border-b border-white-10 last:border-0">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-3 text-left text-base"
                      onClick={() => nav.toggleMobileDropdown(link.id)}
                    >
                      {link.label}
                      <motion.span
                        animate={{ rotate: nav.openMobileDropdownId === link.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <KeyboardArrowDown className="text-scheme-text" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {nav.openMobileDropdownId === link.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {link.children.map((child) => (
                            <a key={child.id} href={child.href} className="block py-2 pl-4 text-base">
                              {child.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ),
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-4">
          <SearchToggle />
          <button
            ref={nav.buttonRef}
            className="-mr-2 flex size-12 flex-col items-center justify-center justify-self-end lg:hidden"
            onClick={nav.toggleMobileMenu}
          >
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-scheme-text"
              animate={nav.isMobileMenuOpen ? { translateY: 8, rotate: 45 } : { translateY: 0, rotate: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-scheme-text"
              animate={{ opacity: nav.isMobileMenuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-scheme-text"
              animate={nav.isMobileMenuOpen ? { translateY: -8, rotate: -45 } : { translateY: 0, rotate: 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </Card>
    </section>
  );
}

function DesktopDropdown({ dropdown }: { dropdown: NavLink }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <p role="button" className="flex items-center gap-2 px-3 py-2 text-base whitespace-nowrap">
        {dropdown.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <KeyboardArrowDown className="text-scheme-text" />
        </motion.span>
      </p>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={`absolute mt-1 flex min-w-full flex-col whitespace-nowrap rounded-card p-2 scheme-4 ${DROPDOWN_PANEL}`}
          >
            {dropdown.children.map((child) => (
              <a key={child.id} href={child.href} className="px-4 py-2 text-left">
                {child.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
