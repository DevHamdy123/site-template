import type { SiteConfig } from "./schema";
import { SECTION_LABELS } from "./section-labels";

export type NavLink = { href: string; label: string };

/** Navbar links come from the sections list in site.config (hero excluded). */
export function getNavLinks(config: Pick<SiteConfig, "sections" | "itemsLabel">): NavLink[] {
  return config.sections
    .filter((s) => s.type !== "hero")
    .map((s) => ({
      href: `#${s.type}`,
      label: s.label ?? (s.type === "items" ? config.itemsLabel : SECTION_LABELS[s.type]),
    }));
}
