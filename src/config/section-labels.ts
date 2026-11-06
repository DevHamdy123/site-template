import type { SectionType } from "./schema";

/** Default Arabic labels used by the navbar. Override per client with `label` in site.config. */
export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "الرئيسية",
  highlights: "معلومات",
  about: "عن المحل",
  items: "المنيو",
  offers: "العروض",
  gallery: "المعرض",
  contact: "تواصل معنا",
};
