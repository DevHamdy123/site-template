import type { MetadataRoute } from "next";
import { siteConfig } from "@/client/site.config";
import { getItems } from "@/lib/data/items";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const home: MetadataRoute.Sitemap[number] = { url: site, changeFrequency: "weekly", priority: 1 };
  if (!siteConfig.features.productPages) return [home];
  const items = await getItems();
  return [
    home,
    ...items.map((item) => ({
      url: `${site}/products/${encodeURIComponent(item.id)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
