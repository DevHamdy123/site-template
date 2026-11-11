"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme-init";

type Mode = "light" | "dark";

// The current mode lives on <html data-theme="...">; React just listens to it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const getSnapshot = (): Mode => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const getServerSnapshot = (): Mode | null => null;

/** Sun / moon button for the navbar. */
export function ThemeToggle() {
  const mode = useSyncExternalStore<Mode | null>(subscribe, getSnapshot, getServerSnapshot);

  // Same size as the button, so the navbar does not jump once the page is interactive.
  if (mode === null) return <span aria-hidden className="size-11" />;

  const next: Mode = mode === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // private mode: the choice just is not remembered
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={next === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}
      className="inline-flex size-11 items-center justify-center rounded-full border border-border transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {mode === "dark" ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
    </button>
  );
}
