import { items } from "@/client/items";
import { siteConfig } from "@/client/site.config";
import type { Item } from "@/config/schema";

/**
 * Data layer. Components call these functions and never import the data file directly.
 * Today the source is a static file; later it can be a Google Sheet or a database
 * (Prisma) by changing only the body of these functions.
 */
export async function getItems(): Promise<Item[]> {
  return items;
}

export async function getCategories(): Promise<string[]> {
  const all = await getItems();
  return Array.from(new Set(all.map((i) => i.category)));
}

/**
 * Items as the pages should show them. When `features.productPages` is off, options and
 * extra photos are ignored, so the site behaves exactly like a plain menu/catalog.
 */
export async function getPublicItems(): Promise<Item[]> {
  const all = await getItems();
  if (siteConfig.features.productPages) return all;
  return all.map((item) => {
    const plain = { ...item };
    delete plain.options;
    delete plain.images;
    return plain;
  });
}
