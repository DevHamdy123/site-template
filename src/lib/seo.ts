import type { Metadata } from "next";
import type { Item, SiteConfig } from "@/config/schema";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * The public address of the site. Priority:
 * 1) NEXT_PUBLIC_SITE_URL (set it to the client's real domain)
 * 2) the Vercel production URL (automatic)
 * 3) localhost for development
 */
export function getSiteUrl(env: Record<string, string | undefined> = process.env): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Demo / template sites should not appear on Google: set NEXT_PUBLIC_NOINDEX=true there. */
export function isNoIndex(env: Record<string, string | undefined> = process.env): boolean {
  return env.NEXT_PUBLIC_NOINDEX === "true";
}

export function buildMetadata(
  config: SiteConfig,
  env: Record<string, string | undefined> = process.env,
): Metadata {
  const ogImage = config.seo?.ogImage ?? config.hero?.image;
  return {
    metadataBase: new URL(getSiteUrl(env)),
    title: { default: config.name, template: `%s | ${config.name}` },
    description: config.description,
    keywords: config.seo?.keywords,
    alternates: { canonical: "/" },
    robots: isNoIndex(env) ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: "ar_EG",
      siteName: config.name,
      title: config.name,
      description: config.description,
      url: "/",
      images: ogImage ? [{ url: ogImage, alt: config.name }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: config.name,
      description: config.description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/** schema.org structured data so Google can show the shop's details (address, hours, phone). */
export function buildJsonLd(config: SiteConfig, siteUrl: string): Record<string, unknown> {
  const { contact, seo, hero } = config;
  const ogImage = seo?.ogImage ?? hero?.image;
  const sameAs = Object.values(contact.social ?? {}).filter(Boolean);
  const hours = contact.openingHours;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": seo?.businessType ?? "LocalBusiness",
    name: config.name,
    description: config.description,
    url: siteUrl,
    inLanguage: "ar",
  };

  if (ogImage) data.image = `${siteUrl}${ogImage}`;
  if (contact.phone) data.telephone = contact.phone;
  if (contact.address) {
    data.address = { "@type": "PostalAddress", streetAddress: contact.address };
  }
  if (contact.mapUrl) data.hasMap = contact.mapUrl;
  if (sameAs.length > 0) data.sameAs = sameAs;
  if (hours) {
    data.openingHoursSpecification = {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: (hours.days ?? [0, 1, 2, 3, 4, 5, 6]).map((d) => DAY_NAMES[d]),
      opens: hours.open,
      closes: hours.close,
    };
  }
  return data;
}

/** schema.org Product, so Google can show the price and availability of one item. */
export function buildProductJsonLd(
  config: SiteConfig,
  item: Item,
  siteUrl: string,
): Record<string, unknown> {
  const images = [item.image, ...(item.images ?? [])].filter((x): x is string => Boolean(x));
  const soldOut = (item.options ?? []).some((g) => g.values.every((v) => v.available === false));
  const url = `${siteUrl}/products/${encodeURIComponent(item.id)}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    sku: item.id,
    category: item.category,
    brand: { "@type": "Brand", name: config.name },
    url,
  };
  if (item.description) data.description = item.description;
  if (images.length > 0) data.image = Array.from(new Set(images)).map((src) => `${siteUrl}${src}`);
  if (item.price !== undefined) {
    data.offers = {
      "@type": "Offer",
      url,
      price: item.price,
      priceCurrency: config.currencyCode,
      availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    };
  }
  return data;
}

/** JSON for a <script> tag: `<` is escaped so the content can never close the tag early. */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
