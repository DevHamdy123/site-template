import type { ComponentType } from "react";
import type { SectionType } from "./schema";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { Items } from "@/components/sections/Items";
import { Offers } from "@/components/sections/Offers";

export type SectionProps = { variant?: string };

/**
 * Maps a section name (from site.config) to its component.
 * Sections that are not built yet are simply missing here and render a placeholder.
 * To add a section: build it in components/sections, then register it below.
 */
export const sectionRegistry: Partial<Record<SectionType, ComponentType<SectionProps>>> = {
  hero: Hero,
  highlights: Highlights,
  items: Items,
  about: About,
  offers: Offers,
  gallery: Gallery,
  contact: Contact,
};
