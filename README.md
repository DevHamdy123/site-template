# site-template

A config-driven website template for small local businesses (cafés, clothing shops, salons, clinics…), built with **Next.js 16, React 19, TypeScript, Tailwind CSS 4 and Zod**. Arabic-first (RTL), mobile-first, and ordering goes through **WhatsApp** — no payment gateway or backend needed.

A new client site is a copy of this template with **three things changed**: one config file, one product list and a folder of images. No component code is touched.

**Live demos:** [Café](https://nile-cafe-demo.vercel.app) · [Clothing store](https://style36-demo.vercel.app)

## Features

- **Config-driven sections** – Hero, Highlights, Items/Menu, Offers, Gallery, About and Contact are switched on, ordered and filled from `site.config.ts`.
- **Cart + WhatsApp order** – cart stored in `localStorage`, line items with options and price deltas, and a ready-to-send WhatsApp message. Invalid or sold-out selections are dropped automatically.
- **Product pages** – a page per item with gallery, colour swatches, size buttons, quantity, related items, `Product` JSON-LD and sitemap entries.
- **QR poster** – a printable A4 `/qr` page (SVG, high error correction, optional logo) pointing at the live site, plus an "open now / closed" notice driven by opening hours.
- **Dark mode** – per-theme dark palettes, a no-flash init script, a toggle, and a configurable default (`system` / `light` / `dark`).
- **Theme presets** – `warm`, `midnight`, `fresh`, `boutique`; colours, radius and heading font are variables, not hard-coded values. Presets can be spread and overridden per client.
- **SEO** – metadata, Open Graph, `LocalBusiness` JSON-LD, `sitemap.xml`, `robots.txt`.
- **Validated at build time** – the config is parsed with Zod, so a typo fails the build instead of shipping a broken page.
- **Quality checks** – unit tests for config, cart, theme contrast (WCAG ≥ 4.5), QR and SEO, plus a Playwright screen check for horizontal overflow.

On the demo sites (mobile, simulated slow 4G): Performance 94–97, Accessibility 100, Best Practices 96. SEO is lower only because demos are deliberately set to `noindex`.

## How a client site is configured

```ts
// src/client/site.config.ts
export const siteConfig = defineSiteConfig({
  name: "Style 36",
  theme: {
    colors: { ...themes.boutique.colors, primary: themes.midnight.colors.primary },
    darkColors: themes.midnight.colors,
    radius: "sm",
    headingFont: "modern",
    defaultMode: "dark",
  },
  features: { cart: true, productPages: true, qr: true, darkMode: true },
  // sections, contact, opening hours, social links…
});
```

Products live in `src/client/items.ts` (with `options` such as colour/size and `priceDelta`), and images in `public/images/`.

## Architecture

| Layer | Files | Changes per client? |
|---|---|---|
| Client | `src/client/*`, `public/images/` | yes |
| Core | `src/app`, `src/components`, `src/config`, `src/lib` | no |

- Core code never reads client files directly; it goes through a data layer (`getItems()`).
- Sections are resolved through a registry, so adding a section type is one component plus one registry entry.
- Each client is a clone of this repo with this repo as the `upstream` remote, so template improvements are merged into client sites with `git merge upstream/main`.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build
```

New client:

```bash
git clone <this-repo> client-name && cd client-name
git remote rename origin upstream
git remote add origin <client-repo>
# edit src/client/* and public/images/ only
```

Deploy on Vercel. Set `NEXT_PUBLIC_SITE_URL` for the production domain and `NEXT_PUBLIC_NOINDEX=true` for demos.

Internal notes in Arabic: [docs/DEVELOPMENT.ar.md](docs/DEVELOPMENT.ar.md).

## Stack

Next.js (App Router, static generation) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Zod 4 · Framer Motion · Vitest · ESLint · Playwright · GitHub Actions CI (lint, typecheck, test, build)
