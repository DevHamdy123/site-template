import { z } from "zod";

/** Section types the template knows about. Add a name here when a new section is built. */
export const SECTION_TYPES = ["hero", "highlights", "about", "items", "offers", "gallery", "contact"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

const hex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a hex color like #1f3a5f");

export const themeSchema = z.object({
  colors: z.object({
    background: hex,
    foreground: hex,
    primary: hex,
    primaryForeground: hex,
    secondary: hex,
    muted: hex,
    mutedForeground: hex,
    accent: hex,
    border: hex,
  }),
  radius: z.enum(["none", "sm", "md", "lg", "xl", "full"]),
  /** modern = Cairo (clean), classic = El Messiri (elegant display) */
  headingFont: z.enum(["modern", "classic"]),
});

export const heroSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  /** Small badge above the title, e.g. "عرض الخريف" */
  badge: z.string().optional(),
  /** Image inside /public, e.g. /images/hero.jpg */
  image: z.string().startsWith("/").optional(),
  ctaLabel: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
});

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  /** Label used for the main list: "المنتجات" / "الخدمات" / "المنيو" */
  itemsLabel: z.string().min(1),
  currency: z.string().min(1),
  theme: themeSchema,
  hero: heroSchema.optional(),
  about: z
    .object({
      title: z.string().optional(),
      text: z.string().min(1),
      /** Short bullet points, e.g. "بن طازج", "جلسات هادية" */
      points: z.array(z.string().min(1)).max(6).optional(),
      image: z.string().startsWith("/").optional(),
    })
    .optional(),
  offers: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        badge: z.string().optional(),
      }),
    )
    .max(6)
    .optional(),
  gallery: z
    .array(z.object({ src: z.string().startsWith("/"), alt: z.string().min(1) }))
    .max(12)
    .optional(),
  /** Small info cards under the hero: opening hours, delivery, what's new... */
  highlights: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .max(4)
    .optional(),
  contact: z.object({
    /** International format, digits only, e.g. 201012345678 */
    whatsapp: z.string().regex(/^\d{8,15}$/, "WhatsApp: digits only, with country code"),
    phone: z.string().optional(),
    address: z.string().optional(),
    /** Link that opens the place in Google Maps */
    mapUrl: z.url().optional(),
    /** Google Maps > Share > Embed a map > copy the src="..." value */
    mapEmbedUrl: z.url().optional(),
    social: z
      .object({
        instagram: z.url().optional(),
        facebook: z.url().optional(),
        tiktok: z.url().optional(),
      })
      .optional(),
    hours: z.string().optional(),
  }),
  sections: z
    .array(
      z.object({
        type: z.enum(SECTION_TYPES),
        variant: z.string().optional(),
        /** Overrides the default label shown in the navbar */
        label: z.string().optional(),
      }),
    )
    .min(1),
  features: z.object({
    cart: z.boolean().default(false),
    booking: z.boolean().default(false),
  }),
});

export type SiteConfig = z.output<typeof siteConfigSchema>;
export type SiteConfigInput = z.input<typeof siteConfigSchema>;
export type Theme = z.output<typeof themeSchema>;

export const itemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  /** Image inside /public, e.g. /images/mug.webp */
  image: z.string().startsWith("/").optional(),
  /** Optional: services may have no fixed price */
  price: z.number().nonnegative().optional(),
  badge: z.string().optional(),
});

export const itemsSchema = z
  .array(itemSchema)
  .refine((items) => new Set(items.map((i) => i.id)).size === items.length, {
    message: "Duplicate item id",
  });

export type Item = z.output<typeof itemSchema>;

/** Validates at build time: a typo in a client's data fails the build, not the live site. */
export function defineSiteConfig(input: SiteConfigInput): SiteConfig {
  return siteConfigSchema.parse(input);
}

export function defineItems(input: z.input<typeof itemsSchema>): Item[] {
  return itemsSchema.parse(input);
}
