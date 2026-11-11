import { z } from "zod";

/** Section types the template knows about. Add a name here when a new section is built. */
export const SECTION_TYPES = ["hero", "highlights", "about", "items", "offers", "gallery", "contact"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

const hex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a hex color like #1f3a5f");

const colorsSchema = z.object({
  background: hex,
  foreground: hex,
  primary: hex,
  primaryForeground: hex,
  secondary: hex,
  muted: hex,
  mutedForeground: hex,
  accent: hex,
  border: hex,
});

export const themeSchema = z.object({
  colors: colorsSchema,
  /** Colors for dark mode. Without them the theme has no dark mode (the toggle is hidden). */
  darkColors: colorsSchema.optional(),
  radius: z.enum(["none", "sm", "md", "lg", "xl", "full"]),
  /** modern = Cairo (clean), classic = El Messiri (elegant display) */
  headingFont: z.enum(["modern", "classic"]),
  /** Which look the site opens in for first-time visitors (when dark mode is on). Default: follow the device. */
  defaultMode: z.enum(["system", "light", "dark"]).optional(),
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

export const BUSINESS_TYPES = [
  "LocalBusiness",
  "CafeOrCoffeeShop",
  "Restaurant",
  "BeautySalon",
  "HealthClub",
  "ClothingStore",
  "Store",
  "MedicalClinic",
  "Dentist",
] as const;

const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must look like "09:00" (24h)');

export const openingHoursSchema = z.object({
  /** "09:00" (24h) */
  open: timeString,
  /** "23:30". "00:00" or any time before `open` means after midnight */
  close: timeString,
  /** 0 = Sunday ... 6 = Saturday. Default: every day */
  days: z.array(z.number().int().min(0).max(6)).min(1).optional(),
  /** IANA timezone of the shop */
  timezone: z.string().default("Africa/Cairo"),
});

export type OpeningHours = z.output<typeof openingHoursSchema>;

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  /** Label used for the main list: "المنتجات" / "الخدمات" / "المنيو" */
  itemsLabel: z.string().min(1),
  currency: z.string().min(1),
  /** ISO code used in structured data for Google (price currency) */
  currencyCode: z.string().length(3).default("EGP"),
  theme: themeSchema,
  /** Search-engine settings. Everything is optional. */
  seo: z
    .object({
      /** schema.org type, helps Google understand the business */
      businessType: z.enum(BUSINESS_TYPES).default("LocalBusiness"),
      /** Image shown when the link is shared (WhatsApp, Facebook). Default: the hero image */
      ogImage: z.string().startsWith("/").optional(),
      keywords: z.array(z.string().min(1)).max(15).optional(),
    })
    .optional(),
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
    /** Free text shown in the Contact section, e.g. "يوميًا من 9 ص إلى 12 م" */
    hours: z.string().optional(),
    /** Structured hours: powers the "open now / closed" badge in the hero */
    openingHours: openingHoursSchema.optional(),
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
  /** Text and logo on the /qr poster. Everything is optional. */
  qr: z
    .object({
      headline: z.string().min(1).optional(),
      text: z.string().min(1).optional(),
      /** Logo shown in the middle of the QR (inside /public). Keep it simple and square. */
      logo: z.string().startsWith("/").optional(),
    })
    .optional(),
  features: z.object({
    cart: z.boolean().default(false),
    /** A page per item (/products/[id]) with gallery and options */
    productPages: z.boolean().default(false),
    /** A printable QR poster at /qr (door sticker: scan to browse and order) */
    qr: z.boolean().default(false),
    /** Light/dark toggle in the navbar (needs `theme.darkColors`) */
    darkMode: z.boolean().default(false),
    booking: z.boolean().default(false),
  }),
});

export type SiteConfig = z.output<typeof siteConfigSchema>;
export type SiteConfigInput = z.input<typeof siteConfigSchema>;
export type Theme = z.output<typeof themeSchema>;

/** One choice inside an option group, e.g. the color "أسود" or the size "L". */
export const optionValueSchema = z.object({
  label: z.string().min(1),
  /** Color circle, e.g. "#111111" (use for colors) */
  swatch: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  /** Photo for this choice (inside /public). Selecting it shows this photo in the gallery. */
  image: z.string().startsWith("/").optional(),
  /** Added to the base price when chosen (e.g. +10 for XXL) */
  priceDelta: z.number().optional(),
  /** false = sold out (shown crossed out, cannot be chosen) */
  available: z.boolean().optional(),
});

export const optionGroupSchema = z
  .object({
    /** "اللون" / "المقاس" */
    name: z.string().min(1),
    values: z.array(optionValueSchema).min(1),
  })
  .refine((g) => new Set(g.values.map((v) => v.label)).size === g.values.length, {
    message: "Duplicate option value in a group",
  });

export const itemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  /** Image inside /public, e.g. /images/mug.webp */
  image: z.string().startsWith("/").optional(),
  /** More photos for the product page gallery (the main image is always first) */
  images: z.array(z.string().startsWith("/")).max(8).optional(),
  /** Choices such as color / size. Shown on the product page (features.productPages). */
  options: z
    .array(optionGroupSchema)
    .max(3)
    .refine((groups) => new Set(groups.map((g) => g.name)).size === groups.length, {
      message: "Duplicate option group name",
    })
    .optional(),
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
export type OptionGroup = z.output<typeof optionGroupSchema>;
export type OptionValue = z.output<typeof optionValueSchema>;

/** Validates at build time: a typo in a client's data fails the build, not the live site. */
export function defineSiteConfig(input: SiteConfigInput): SiteConfig {
  return siteConfigSchema.parse(input);
}

export function defineItems(input: z.input<typeof itemsSchema>): Item[] {
  return itemsSchema.parse(input);
}
