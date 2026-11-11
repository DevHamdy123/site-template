import { describe, expect, it } from "vitest";
import { defineSiteConfig, themeSchema } from "@/config/schema";
import { siteConfig } from "@/client/site.config";
import { themes } from "@/config/themes";
import { isDarkModeEnabled, themeToCss } from "@/config/theme-vars";

/** WCAG contrast ratio between two hex colors. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.replace(/(.)/g, "$1$1") : h;
    const [r, g, bl] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
    const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("theme presets", () => {
  for (const [name, theme] of Object.entries(themes)) {
    it(`${name} is a valid theme`, () => {
      expect(themeSchema.safeParse(theme).success).toBe(true);
    });

    const palettes: [string, Record<string, string>][] = [["light", theme.colors]];
    const dark = (theme as { darkColors?: Record<string, string> }).darkColors;
    if (dark) palettes.push(["dark", dark]);

    for (const [mode, c] of palettes) {
      it(`${name} (${mode}): text and buttons are readable`, () => {
        expect(contrast(c.foreground, c.background)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(c.primaryForeground, c.primary)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});

describe("dark mode css", () => {
  const base = siteConfig;

  it("is off unless the feature is on and the theme has a dark palette", () => {
    expect(isDarkModeEnabled({ ...base, features: { ...base.features, darkMode: false } })).toBe(false);
    expect(
      isDarkModeEnabled({ ...base, theme: themes.midnight, features: { ...base.features, darkMode: true } }),
    ).toBe(false);
    expect(isDarkModeEnabled({ ...base, theme: themes.boutique, features: { ...base.features, darkMode: true } })).toBe(
      true,
    );
  });

  it("adds dark variables only when enabled", () => {
    const on = themeToCss({ ...base, theme: themes.boutique, features: { ...base.features, darkMode: true } });
    expect(on).toContain('[data-theme="dark"]');
    expect(on).toContain(themes.boutique.darkColors.background);
    const off = themeToCss({ ...base, theme: themes.boutique, features: { ...base.features, darkMode: false } });
    expect(off).not.toContain("dark");
  });

  it("darkMode defaults to false", () => {
    expect(defineSiteConfig({ ...siteConfig, features: {} }).features.darkMode).toBe(false);
  });
});
