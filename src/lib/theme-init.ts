export const THEME_STORAGE_KEY = "site-theme";

/**
 * Runs before the page paints: picks the saved theme, or the device setting, so there is
 * no white flash for visitors who use dark mode.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;
