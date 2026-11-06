import { describe, expect, it } from "vitest";
import type { Item } from "@/config/schema";
import {
  MAX_QTY,
  addEntry,
  buildOrderMessage,
  cartCount,
  cartTotal,
  isOrderReady,
  parseEntries,
  resolveLines,
  setQty,
} from "@/lib/cart/cart";
import { formatPrice } from "@/lib/utils";

const items: Item[] = [
  { id: "latte", name: "لاتيه", category: "قهوة", price: 55 },
  { id: "cake", name: "تشيز كيك", category: "حلويات", price: 70 },
  { id: "free", name: "إضافة", category: "حلويات" }, // no price
];

describe("entries", () => {
  it("adds and increments", () => {
    let e = addEntry([], "latte");
    e = addEntry(e, "latte");
    e = addEntry(e, "cake");
    expect(e).toEqual([
      { id: "latte", qty: 2 },
      { id: "cake", qty: 1 },
    ]);
  });

  it("removes an item when quantity reaches 0", () => {
    const e = setQty([{ id: "latte", qty: 1 }], "latte", 0);
    expect(e).toEqual([]);
  });

  it("caps the quantity", () => {
    expect(setQty([], "latte", 500)).toEqual([{ id: "latte", qty: MAX_QTY }]);
  });

  it("ignores NaN quantities", () => {
    expect(setQty([{ id: "latte", qty: 2 }], "latte", Number.NaN)).toEqual([]);
  });
});

describe("parseEntries", () => {
  it("reads valid data", () => {
    expect(parseEntries('[{"id":"latte","qty":2}]')).toEqual([{ id: "latte", qty: 2 }]);
  });
  it("drops broken, duplicate or invalid rows", () => {
    const raw = JSON.stringify([
      { id: "latte", qty: 2 },
      { id: "latte", qty: 5 },
      { id: "cake", qty: 0 },
      { id: "x", qty: 1.5 },
      { qty: 1 },
      null,
      "text",
    ]);
    expect(parseEntries(raw)).toEqual([{ id: "latte", qty: 2 }]);
  });
  it("returns an empty cart for garbage", () => {
    expect(parseEntries("not json")).toEqual([]);
    expect(parseEntries('{"a":1}')).toEqual([]);
  });
});

describe("lines and totals", () => {
  const lines = resolveLines(items, [
    { id: "latte", qty: 2 },
    { id: "cake", qty: 1 },
    { id: "gone", qty: 3 }, // removed from the menu since
  ]);

  it("drops items that no longer exist and uses current prices", () => {
    expect(lines.map((l) => l.id)).toEqual(["latte", "cake"]);
  });
  it("counts and totals", () => {
    expect(cartCount(lines)).toBe(3);
    expect(cartTotal(lines)).toBe(2 * 55 + 70);
  });
  it("treats a missing price as 0 in the total", () => {
    expect(cartTotal(resolveLines(items, [{ id: "free", qty: 2 }]))).toBe(0);
  });
});

describe("order", () => {
  const lines = resolveLines(items, [
    { id: "latte", qty: 2 },
    { id: "cake", qty: 1 },
  ]);

  it("is ready for pickup, and for delivery only with an address", () => {
    expect(isOrderReady(lines, { mode: "pickup" })).toBe(true);
    expect(isOrderReady(lines, { mode: "delivery" })).toBe(false);
    expect(isOrderReady(lines, { mode: "delivery", address: "  " })).toBe(false);
    expect(isOrderReady(lines, { mode: "delivery", address: "شارع الجمهورية" })).toBe(true);
    expect(isOrderReady([], { mode: "pickup" })).toBe(false);
  });

  it("builds a pickup message", () => {
    const msg = buildOrderMessage({
      shopName: "مقهى النيل",
      lines,
      currency: "ج.م",
      customer: { mode: "pickup", name: "حمدي", notes: "من غير سكر" },
    });
    expect(msg).toContain("طلب جديد من موقع مقهى النيل");
    expect(msg).toContain(`• 2× لاتيه — ${formatPrice(110, "ج.م")}`);
    expect(msg).toContain(`• 1× تشيز كيك — ${formatPrice(70, "ج.م")}`);
    expect(msg).toContain(`الإجمالي: ${formatPrice(180, "ج.م")}`);
    expect(msg).toContain("استلام من المحل");
    expect(msg).toContain("الاسم: حمدي");
    expect(msg).toContain("ملاحظات: من غير سكر");
    expect(msg).not.toContain("العنوان");
  });

  it("builds a delivery message with the address and the delivery note", () => {
    const msg = buildOrderMessage({
      shopName: "مقهى النيل",
      lines,
      currency: "ج.م",
      customer: { mode: "delivery", address: " شارع الجمهورية " },
    });
    expect(msg).toContain("توصيل");
    expect(msg).toContain("العنوان: شارع الجمهورية");
    expect(msg).toContain("سعر التوصيل يتحدد عند التأكيد");
    expect(msg).not.toContain("الاسم");
  });
});
