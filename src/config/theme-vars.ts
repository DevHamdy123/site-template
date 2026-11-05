import type { Theme } from "./schema";

const RADIUS: Record<Theme["radius"], string> = {
  none: "0px",
  sm: "0.375rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
};

/** Turns the theme from site.config into CSS variables (consumed in globals.css). */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const c = theme.colors;
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
    "--radius": RADIUS[theme.radius],
  };
}
