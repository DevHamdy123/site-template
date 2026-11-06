"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { NavLink } from "@/config/nav";

type NavbarProps = {
  name: string;
  links: NavLink[];
  whatsappHref: string;
};

export function Navbar({ name, links, whatsappHref }: NavbarProps) {
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
        <a href="#hero" className="text-xl font-extrabold text-primary">
          {name}
        </a>

        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-foreground/80 transition hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-lg font-semibold text-foreground hover:bg-muted"
                >
                  {link.label}
                </a>
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
