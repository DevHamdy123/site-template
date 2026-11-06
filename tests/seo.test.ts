import { describe, expect, it } from "vitest";
import { defineSiteConfig } from "@/config/schema";
import { themes } from "@/config/themes";
import { buildJsonLd, buildMetadata, getSiteUrl, isNoIndex, serializeJsonLd } from "@/lib/seo";

const config = defineSiteConfig({
  name: "مقهى النيل",
  tagline: "t",
  description: "وصف",
  itemsLabel: "المنيو",
  currency: "ج.م",
  theme: themes.warm,
  seo: { businessType: "CafeOrCoffeeShop" },
  hero: { image: "/images/hero.webp" },
  contact: {
    whatsapp: "201000000000",
    phone: "01000000000",
    address: "المنصورة",
    openingHours: { open: "09:00", close: "00:00", days: [0, 1] },
    social: { instagram: "https://instagram.com/nile" },
  },
  sections: [{ type: "hero" }],
  features: {},
});

describe("getSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL and trims trailing slashes", () => {
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://nile.com/" })).toBe("https://nile.com");
  });
  it("falls back to the Vercel URL, then localhost", () => {
    expect(getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "demo.vercel.app" })).toBe(
      "https://demo.vercel.app",
    );
    expect(getSiteUrl({})).toBe("http://localhost:3000");
  });
});

describe("noindex", () => {
  it("is only on when explicitly 'true'", () => {
    expect(isNoIndex({ NEXT_PUBLIC_NOINDEX: "true" })).toBe(true);
    expect(isNoIndex({ NEXT_PUBLIC_NOINDEX: "false" })).toBe(false);
    expect(isNoIndex({})).toBe(false);
  });
});

describe("buildMetadata", () => {
  it("uses the hero image for sharing and blocks indexing when asked", () => {
    const m = buildMetadata(config, { NEXT_PUBLIC_NOINDEX: "true" });
    expect(m.openGraph?.images).toEqual([{ url: "/images/hero.webp", alt: "مقهى النيل" }]);
    expect(m.robots).toEqual({ index: false, follow: false });
  });
});

describe("buildJsonLd", () => {
  const data = buildJsonLd(config, "https://nile.com");
  it("describes the business", () => {
    expect(data["@type"]).toBe("CafeOrCoffeeShop");
    expect(data.image).toBe("https://nile.com/images/hero.webp");
    expect(data.telephone).toBe("01000000000");
    expect(data.sameAs).toEqual(["https://instagram.com/nile"]);
  });
  it("maps opening hours and days", () => {
    expect(data.openingHoursSpecification).toMatchObject({
      dayOfWeek: ["Sunday", "Monday"],
      opens: "09:00",
      closes: "00:00",
    });
  });
  it("escapes < so it cannot close the script tag", () => {
    const out = serializeJsonLd({ name: "</script><b>" });
    expect(out).not.toContain("<");
  });
});
