import { describe, expect, it } from "vitest";
import { defineItems, defineSiteConfig, type Item } from "@/config/schema";
import { siteConfig } from "@/client/site.config";
import {
  addEntry,
  buildOrderMessage,
  buildQuickOrderMessage,
  cartTotal,
  defaultSelection,
  hasPriceVariation,
  isSelectionValid,
  lineKey,
  parseEntries,
  priceFor,
  resolveLines,
  setQty,
  startingPrice,
} from "@/lib/cart/cart";
import { buildProductJsonLd } from "@/lib/seo";

const hoodie: Item = {
  id: "hoodie",
  name: "هودي",
  category: "ملابس",
  price: 500,
  options: [
    {
      name: "اللون",
      values: [{ label: "أسود", swatch: "#111111" }, { label: "رمادي", swatch: "#888888" }],
    },
    {
      name: "المقاس",
      values: [
        { label: "M", available: false },
        { label: "L" },
        { label: "XXL", priceDelta: 30 },
      ],
    },
  ],
};
const plain: Item = { id: "cap", name: "كاب", category: "إكسسوار", price: 100 };
const items = [hoodie, plain];

describe("options schema", () => {
  it("accepts items with images and options", () => {
    expect(() => defineItems([{ ...hoodie, images: ["/images/a.webp"] }])).not.toThrow();
  });
  it("rejects duplicate values in a group, duplicate group names and bad swatches", () => {
    const g = (values: { label: string }[]) => ({ name: "اللون", values });
    expect(() => defineItems([{ ...plain, options: [g([{ label: "a" }, { label: "a" }])] }])).toThrow();
    expect(() =>
      defineItems([{ ...plain, options: [g([{ label: "a" }]), g([{ label: "b" }])] }]),
    ).toThrow();
    expect(() =>
      defineItems([{ ...plain, options: [{ name: "x", values: [{ label: "a", swatch: "red" }] }] }]),
    ).toThrow();
  });
  it("productPages defaults to false and the demo config stays valid", () => {
    expect(defineSiteConfig({ ...siteConfig, features: {} }).features.productPages).toBe(false);
  });
});

describe("selections and prices", () => {
  it("picks the first available value in each group", () => {
    expect(defaultSelection(hoodie)).toEqual({ اللون: "أسود", المقاس: "L" });
    expect(defaultSelection(plain)).toEqual({});
  });
  it("validates selections", () => {
    expect(isSelectionValid(hoodie, { اللون: "أسود", المقاس: "L" })).toBe(true);
    expect(isSelectionValid(hoodie, { اللون: "أسود", المقاس: "M" })).toBe(false); // sold out
    expect(isSelectionValid(hoodie, { اللون: "أسود" })).toBe(false); // incomplete
    expect(isSelectionValid(hoodie, { اللون: "أزرق", المقاس: "L" })).toBe(false); // unknown
    expect(isSelectionValid(plain, undefined)).toBe(true);
  });
  it("adds option extras to the price", () => {
    expect(priceFor(hoodie, { اللون: "أسود", المقاس: "XXL" })).toBe(530);
    expect(priceFor(hoodie, { اللون: "أسود", المقاس: "L" })).toBe(500);
    expect(startingPrice(hoodie)).toBe(500);
    expect(hasPriceVariation(hoodie)).toBe(true);
    expect(hasPriceVariation(plain)).toBe(false);
  });
});

describe("cart lines with options", () => {
  const black = { اللون: "أسود", المقاس: "L" };
  const grey = { اللون: "رمادي", المقاس: "L" };

  it("builds a stable key regardless of key order", () => {
    expect(lineKey("a")).toBe("a");
    expect(lineKey("a", {})).toBe("a");
    expect(lineKey("a", { b: "1", a: "2" })).toBe(lineKey("a", { a: "2", b: "1" }));
  });
  it("keeps the same product with different options as separate lines", () => {
    let e = addEntry([], "hoodie", black);
    e = addEntry(e, "hoodie", black);
    e = addEntry(e, "hoodie", grey, 3);
    expect(e).toEqual([
      { id: "hoodie", qty: 2, options: black },
      { id: "hoodie", qty: 3, options: grey },
    ]);
    expect(setQty(e, "hoodie", 0, black)).toEqual([{ id: "hoodie", qty: 3, options: grey }]);
  });
  it("round-trips through parseEntries and drops broken options", () => {
    const e = addEntry([], "hoodie", black);
    expect(parseEntries(JSON.stringify(e))).toEqual(e);
    expect(parseEntries('[{"id":"hoodie","qty":1,"options":{"a":5}}]')).toEqual([
      { id: "hoodie", qty: 1 },
    ]);
  });
  it("resolves names, labels and prices; drops choices that no longer exist", () => {
    const lines = resolveLines(items, [
      { id: "hoodie", qty: 2, options: { اللون: "أسود", المقاس: "XXL" } },
      { id: "hoodie", qty: 1, options: { اللون: "أسود", المقاس: "M" } }, // sold out since
      { id: "hoodie", qty: 1 }, // no choices made
      { id: "cap", qty: 1 },
    ]);
    expect(lines.map((l) => l.key)).toEqual([lineKey("hoodie", { اللون: "أسود", المقاس: "XXL" }), "cap"]);
    expect(lines[0].options).toEqual([
      { name: "اللون", label: "أسود" },
      { name: "المقاس", label: "XXL" },
    ]);
    expect(cartTotal(lines)).toBe(2 * 530 + 100);
  });
  it("shows the choices in the WhatsApp message", () => {
    const lines = resolveLines(items, [{ id: "hoodie", qty: 1, options: black }]);
    const msg = buildOrderMessage({ shopName: "ستايل", lines, currency: "ج.م", customer: { mode: "pickup" } });
    expect(msg).toContain("• 1× هودي (أسود / L)");
  });
  it("builds a quick order message from a product page", () => {
    const msg = buildQuickOrderMessage({ item: hoodie, selection: black, qty: 2, currency: "ج.م" });
    expect(msg).toContain("2× هودي");
    expect(msg).toContain("اللون: أسود");
    expect(msg).toContain("المقاس: L");
  });
});

describe("product structured data", () => {
  it("describes price, currency and availability", () => {
    const data = buildProductJsonLd({ ...siteConfig, currencyCode: "EGP" }, hoodie, "https://x.com") as {
      offers: { price: number; priceCurrency: string; availability: string };
    };
    expect(data.offers.price).toBe(500);
    expect(data.offers.priceCurrency).toBe("EGP");
    expect(data.offers.availability).toContain("InStock");
  });
  it("marks a fully sold-out option group as out of stock", () => {
    const soldOut: Item = { ...hoodie, options: [{ name: "المقاس", values: [{ label: "L", available: false }] }] };
    const data = buildProductJsonLd(siteConfig, soldOut, "https://x.com") as {
      offers: { availability: string };
    };
    expect(data.offers.availability).toContain("OutOfStock");
  });
});
