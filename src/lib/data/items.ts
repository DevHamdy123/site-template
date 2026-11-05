import { items } from "@/client/items";
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
