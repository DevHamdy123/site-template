import type { Item } from "@/config/schema";
import { matchesQuery } from "./search";

/** category = null means "all categories". The query searches name, description and category. */
export function filterItems(items: Item[], category: string | null, query: string): Item[] {
  return items.filter(
    (item) =>
      (category === null || item.category === category) &&
      matchesQuery(`${item.name} ${item.description ?? ""} ${item.category}`, query),
  );
}
