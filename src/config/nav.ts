import type { SectionType, SiteConfig } from "./schema";
import { SECTION_LABELS } from "./section-labels";

export type NavLink = { href: string; label: string };

type NavConfig = Pick<SiteConfig, "sections" | "itemsLabel"> &
  Partial<Pick<SiteConfig, "about" | "offers" | "gallery">>;

/** A section that needs data is only linked when the client actually provided it. */
function hasContent(type: SectionType, config: NavConfig): boolean {
  switch (type) {
    case "about":
      return Boolean(config.about);
    case "offers":
      return (config.offers?.length ?? 0) > 0;
    case "gallery":
      return (config.gallery?.length ?? 0) > 0;
    default:
      return true;
  }
}

/** Navbar links come from the sections list in site.config (hero and highlights excluded). */
export function getNavLinks(config: NavConfig): NavLink[] {
  return config.sections
    .filter((s) => s.type !== "hero" && s.type !== "highlights" && hasContent(s.type, config))
    .map((s) => ({
      href: `#${s.type}`,
      label: s.label ?? (s.type === "items" ? config.itemsLabel : SECTION_LABELS[s.type]),
    }));
}
