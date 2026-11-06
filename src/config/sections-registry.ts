import type { ComponentType } from "react";
import type { SectionType } from "./schema";
import { Hero } from "@/components/sections/Hero";

export type SectionProps = { variant?: string };

/**
 * Maps a section name (from site.config) to its component.
 * Sections that are not built yet are simply missing here and render a placeholder.
 * To add a section: build it in components/sections, then register it below.
 */
export const sectionRegistry: Partial<Record<SectionType, ComponentType<SectionProps>>> = {
  hero: Hero,
};
