import { describe, expect, it } from "vitest";
import { defineSiteConfig } from "@/config/schema";
import { siteConfig } from "@/client/site.config";
import { buildQrSvg } from "@/lib/qr";

describe("qr", () => {
  it("builds an svg for a url", async () => {
    const svg = await buildQrSvg("https://example.com");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("gives different codes for different sites", async () => {
    const a = await buildQrSvg("https://cafe.example.com");
    const b = await buildQrSvg("https://clothes.example.com");
    expect(a).not.toBe(b);
  });

  it("is off by default and accepts a custom poster text and logo", () => {
    expect(defineSiteConfig({ ...siteConfig, features: {} }).features.qr).toBe(false);
    expect(() =>
      defineSiteConfig({
        ...siteConfig,
        qr: { headline: "مرحبًا", text: "امسح", logo: "/images/logo.webp" },
      }),
    ).not.toThrow();
  });

  it("rejects a logo path outside /public", () => {
    expect(() =>
      defineSiteConfig({ ...siteConfig, qr: { logo: "images/logo.webp" } }),
    ).toThrow();
  });
});
