import { describe, expect, it } from "vitest";
import { matchesQuery, normalizeText } from "@/lib/search";
import { filterItems } from "@/lib/items-filter";
import type { Item } from "@/config/schema";

const items: Item[] = [
  { id: "1", name: "لاتيه", description: "إسبريسو مع حليب", category: "قهوة ساخنة", price: 55 },
  { id: "2", name: "آيس لاتيه", category: "قهوة باردة", price: 60 },
  { id: "3", name: "تشيز كيك", category: "حلويات", price: 70 },
];

describe("search", () => {
  it("normalizes arabic letter variants", () => {
    expect(normalizeText("إسبريسو")).toBe(normalizeText("اسبريسو"));
    expect(normalizeText("قهوة")).toBe(normalizeText("قهوه"));
    expect(normalizeText("  Latte  ")).toBe("latte");
  });

  it("matches ignoring tashkeel and case", () => {
    expect(matchesQuery("قَهوة ساخنة", "قهوه")).toBe(true);
    expect(matchesQuery("Iced Latte", "latte")).toBe(true);
    expect(matchesQuery("براوني", "")).toBe(true);
    expect(matchesQuery("براوني", "كرواسون")).toBe(false);
  });
});

describe("filterItems", () => {
  it("returns everything with no category and no query", () => {
    expect(filterItems(items, null, "")).toHaveLength(3);
  });

  it("filters by category", () => {
    expect(filterItems(items, "حلويات", "").map((i) => i.id)).toEqual(["3"]);
  });

  it("searches name and description", () => {
    expect(filterItems(items, null, "لاتيه").map((i) => i.id)).toEqual(["1", "2"]);
    expect(filterItems(items, null, "حليب").map((i) => i.id)).toEqual(["1"]);
  });

  it("combines category and query", () => {
    expect(filterItems(items, "قهوة باردة", "لاتيه").map((i) => i.id)).toEqual(["2"]);
    expect(filterItems(items, "حلويات", "لاتيه")).toEqual([]);
  });
});
