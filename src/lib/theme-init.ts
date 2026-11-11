export const THEME_STORAGE_KEY = "site-theme";

export type DefaultMode = "system" | "light" | "dark";

/**
 * Runs before the page paints: picks the visitor's saved theme, otherwise the site's default
 * (the device setting unless the config says "light" or "dark"), so there is no flash.
 */
export function themeInitScript(defaultMode: DefaultMode = "system"): string {
  const fallback =
    defaultMode === "system"
      ? 'window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"'
      : JSON.stringify(defaultMode);
  return `(function(){var t;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=${fallback}}document.documentElement.dataset.theme=t})();`;
}
