import { describe, expect, it } from "vitest";
import { defineItems, defineSiteConfig, siteConfigSchema } from "@/config/schema";
import { themes } from "@/config/themes";
import { themeToCssVars } from "@/config/theme-vars";
import { siteConfig } from "@/client/site.config";
import { items } from "@/client/items";

describe("site config", () => {
  it("the example client config is valid", () => {
    expect(siteConfigSchema.safeParse(siteConfig).success).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it("rejects a bad WhatsApp number", () => {
    expect(() =>
      defineSiteConfig({ ...siteConfig, contact: { whatsapp: "01000" } }),
    ).toThrow();
  });

  it("rejects an invalid color", () => {
    expect(() =>
      defineSiteConfig({
        ...siteConfig,
        theme: { ...themes.warm, colors: { ...themes.warm.colors, primary: "green" } },
      }),
    ).toThrow();
  });

  it("rejects an unknown section type", () => {
    expect(() =>
      defineSiteConfig({
        ...siteConfig,
        // @ts-expect-error testing invalid input on purpose
        sections: [{ type: "unknown" }],
      }),
    ).toThrow();
  });
});

describe("items", () => {
  it("rejects duplicate ids", () => {
    expect(() =>
      defineItems([
        { id: "a", name: "A", category: "x" },
        { id: "a", name: "B", category: "x" },
      ]),
    ).toThrow();
  });

  it("allows items without a price (services)", () => {
    expect(() => defineItems([{ id: "cut", name: "قصّة", category: "خدمات" }])).not.toThrow();
  });
});

describe("theme", () => {
  it("maps the theme to css variables", () => {
    const vars = themeToCssVars(themes.warm);
    expect(vars["--primary"]).toBe(themes.warm.colors.primary);
    expect(vars["--radius"]).toBe("1.5rem");
    expect(vars["--font-heading"]).toBe("var(--font-messiri)");
    expect(themeToCssVars(themes.fresh)["--font-heading"]).toBe("var(--font-cairo)");
  });
});
