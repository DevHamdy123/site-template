import type { Metadata, Viewport } from "next";
import { Cairo, El_Messiri } from "next/font/google";
import { siteConfig } from "@/client/site.config";
import { isDarkModeEnabled, themeToCss } from "@/config/theme-vars";
import { MotionProvider } from "@/components/MotionProvider";
import { buildMetadata } from "@/lib/seo";
import { themeInitScript } from "@/lib/theme-init";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const messiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-messiri",
  display: "swap",
});

export const metadata: Metadata = buildMetadata(siteConfig);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.theme.colors.primary,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${messiri.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeToCss(siteConfig) }} />
        {isDarkModeEnabled(siteConfig) && (
          <script dangerouslySetInnerHTML={{ __html: themeInitScript(siteConfig.theme.defaultMode) }} />
        )}
      </head>
      <body className="min-h-dvh font-sans antialiased"><MotionProvider>{children}</MotionProvider></body>
    </html>
  );
}
