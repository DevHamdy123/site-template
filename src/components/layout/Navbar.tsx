"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { NavLink } from "@/config/nav";

type NavbarProps = {
  name: string;
  links: NavLink[];
  whatsappHref: string;
  /** Cart button (only passed when features.cart is on) */
  cart?: React.ReactNode;
  /** Light/dark button (only passed when dark mode is on) */
  themeToggle?: React.ReactNode;
  /** Where the brand name links to: "#hero" on the home page, "/" on other pages */
  homeHref?: string;
};

export function Navbar({ name, links, whatsappHref, cart, themeToggle, homeHref = "#hero" }: NavbarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={homeHref} className="text-xl font-extrabold text-primary">
          {name}
        </Link>

        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-foreground/80 transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {themeToggle}
          {cart}
          <ButtonLink
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 px-4 py-2 text-sm md:inline-flex"
          >
            <MessageCircle size={18} aria-hidden />
            واتساب
          </ButtonLink>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border md:hidden"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-background shadow-lg md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-lg font-semibold text-foreground hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              <ButtonLink
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2"
              >
                <MessageCircle size={20} aria-hidden />
                تواصل عبر واتساب
              </ButtonLink>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
