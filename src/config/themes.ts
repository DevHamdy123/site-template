import type { Theme } from "./schema";

/** Ready-made identities. A client picks one and may override single values. */
export const themes = {
  warm: {
    colors: {
      background: "#faf6ef",
      foreground: "#1f2a24",
      primary: "#1f4d36",
      primaryForeground: "#ffffff",
      secondary: "#efe6d8",
      muted: "#f3ece0",
      mutedForeground: "#6b6b62",
      accent: "#c8643c",
      border: "#e6dccb",
    },
    radius: "xl",
  },
  midnight: {
    colors: {
      background: "#0f1115",
      foreground: "#f2f2f2",
      primary: "#d4a64a",
      primaryForeground: "#1a1a1a",
      secondary: "#1b1e25",
      muted: "#171a20",
      mutedForeground: "#9aa0aa",
      accent: "#e0b95e",
      border: "#2a2e37",
    },
    radius: "md",
  },
  fresh: {
    colors: {
      background: "#ffffff",
      foreground: "#14213d",
      primary: "#2563eb",
      primaryForeground: "#ffffff",
      secondary: "#eff4ff",
      muted: "#f4f7fb",
      mutedForeground: "#5b6478",
      accent: "#f97316",
      border: "#e2e8f0",
    },
    radius: "lg",
  },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;
