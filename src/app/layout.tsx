import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { siteConfig } from "@/client/site.config";
import { themeToCssVars } from "@/config/theme-vars";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

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
      className={cairo.variable}
      style={themeToCssVars(siteConfig.theme) as React.CSSProperties}
    >
      <body className="min-h-dvh font-sans antialiased"><MotionProvider>{children}</MotionProvider></body>
    </html>
  );
}
