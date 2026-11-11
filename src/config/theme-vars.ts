import type { SiteConfig, Theme } from "./schema";

const RADIUS: Record<Theme["radius"], string> = {
  none: "0px",
  sm: "0.375rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
};

function colorVars(c: Theme["colors"]): Record<string, string> {
  return {
    "--background": c.background,
    "--foreground": c.foreground,
    "--primary": c.primary,
    "--primary-foreground": c.primaryForeground,
    "--secondary": c.secondary,
    "--muted": c.muted,
    "--muted-foreground": c.mutedForeground,
    "--accent": c.accent,
    "--border": c.border,
  };
}

/** Turns the theme from site.config into CSS variables (consumed in globals.css). */
export function themeToCssVars(theme: Theme): Record<string, string> {
  return {
    ...colorVars(theme.colors),
    "--radius": RADIUS[theme.radius],
    "--font-heading": theme.headingFont === "classic" ? "var(--font-messiri)" : "var(--font-cairo)",
  };
}

/** Dark mode needs the feature turned on AND a dark palette in the theme. */
export function isDarkModeEnabled(config: Pick<SiteConfig, "theme" | "features">): boolean {
  return config.features.darkMode && Boolean(config.theme.darkColors);
}

const declarations = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");

/**
 * The <style> content for the page: light variables, and the dark ones under data-theme="dark".
 * Every value is a validated hex color or a fixed string, so it is safe to inject.
 */
export function themeToCss(config: Pick<SiteConfig, "theme" | "features">): string {
  let css = `html:root{${declarations(themeToCssVars(config.theme))}}`;
  if (isDarkModeEnabled(config) && config.theme.darkColors) {
    css += `html:root[data-theme="dark"]{color-scheme:dark;${declarations(colorVars(config.theme.darkColors))}}`;
    // An element marked data-theme="light" (e.g. the print poster) stays light inside a dark page.
    css += `[data-theme="light"]{color-scheme:light;${declarations(colorVars(config.theme.colors))}}`;
  }
  return css;
}
