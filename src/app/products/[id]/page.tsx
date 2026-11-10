import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/client/site.config";
import { ItemGrid } from "@/components/items/ItemGrid";
import { ProductDetail } from "@/components/items/ProductDetail";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { getItems, getPublicItems } from "@/lib/data/items";
import { buildProductJsonLd, getSiteUrl, serializeJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ id: string }> };

// Only ids that exist are valid pages; anything else is a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  if (!siteConfig.features.productPages) return [];
  const items = await getItems();
  return items.map((item) => ({ id: item.id }));
}

async function findItem(rawId: string) {
  if (!siteConfig.features.productPages) return undefined;
  const id = decodeURIComponent(rawId);
  return (await getPublicItems()).find((i) => i.id === id);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await findItem((await params).id);
  if (!item) return {};
  const description = item.description ?? `${item.name} — ${siteConfig.name}`;
  return {
    title: item.name,
    description,
    alternates: { canonical: `/products/${item.id}` },
    openGraph: {
      type: "website",
      title: item.name,
      description,
      url: `/products/${item.id}`,
      images: item.image ? [{ url: item.image, alt: item.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const item = await findItem((await params).id);
  if (!item) notFound();

  const { itemsLabel, currency, contact, features } = siteConfig;
  const all = await getPublicItems();
  const related = all.filter((i) => i.category === item.category && i.id !== item.id).slice(0, 4);
  const jsonLd = serializeJsonLd(buildProductJsonLd(siteConfig, item, getSiteUrl()));

  return (
    <SiteShell subpage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <main className="py-8 sm:py-12">
        <Container>
          <nav aria-label="مسار الصفحة" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">الرئيسية</Link>
            <ChevronRight size={14} aria-hidden className="rotate-180" />
            <Link href="/#items" className="hover:text-primary">{itemsLabel}</Link>
          </nav>

          <ProductDetail item={item} currency={currency} whatsapp={contact.whatsapp} />

          {related.length > 0 && (
            <section className="mt-16" aria-labelledby="related-title">
              <h2 id="related-title" className="mb-6 text-2xl font-bold">منتجات مشابهة</h2>
              <ItemGrid
                items={related}
                currency={currency}
                whatsapp={contact.whatsapp}
                cartEnabled={features.cart}
                productPages
              />
            </section>
          )}
        </Container>
      </main>
    </SiteShell>
  );
}
