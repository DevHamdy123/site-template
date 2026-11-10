import type { Item } from "@/config/schema";
import { formatPrice } from "@/lib/utils";

/** The choices made on a product, e.g. { "اللون": "أسود", "المقاس": "L" }. */
export type Selection = Record<string, string>;

/** What we keep in the browser: id, quantity and the chosen options. Names/prices come from the current items. */
export type CartEntry = { id: string; qty: number; options?: Selection };

export type CartLine = {
  /** Unique per item + options (the same hoodie in two sizes = two lines) */
  key: string;
  id: string;
  name: string;
  price?: number;
  qty: number;
  options: { name: string; label: string }[];
  selection?: Selection;
};

export type OrderMode = "pickup" | "delivery";

export type Customer = {
  mode: OrderMode;
  name?: string;
  address?: string;
  notes?: string;
};

export const MAX_QTY = 99;

function cleanSelection(options?: Selection): Selection | undefined {
  if (!options) return undefined;
  const keys = Object.keys(options);
  return keys.length > 0 ? options : undefined;
}

/** Stable key: the id alone, or id|name=label&name=label (sorted by name). */
export function lineKey(id: string, options?: Selection): string {
  const sel = cleanSelection(options);
  if (!sel) return id;
  const parts = Object.keys(sel)
    .sort()
    .map((name) => `${name}=${sel[name]}`);
  return `${id}|${parts.join("&")}`;
}

function readSelection(value: unknown): Selection | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const out: Selection = {};
  for (const [name, label] of Object.entries(value as Record<string, unknown>)) {
    if (typeof label !== "string") return undefined;
    out[name] = label;
  }
  return cleanSelection(out);
}

/** Safely reads what was saved in localStorage. Anything unexpected is dropped. */
export function parseEntries(raw: string): CartEntry[] {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    const entries: CartEntry[] = [];
    for (const row of data) {
      if (typeof row !== "object" || row === null) continue;
      const { id, qty, options } = row as Record<string, unknown>;
      if (typeof id !== "string" || id === "") continue;
      if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1) continue;
      const selection = readSelection(options);
      const key = lineKey(id, selection);
      if (seen.has(key)) continue;
      seen.add(key);
      const entry: CartEntry = { id, qty: Math.min(qty, MAX_QTY) };
      if (selection) entry.options = selection;
      entries.push(entry);
    }
    return entries;
  } catch {
    return [];
  }
}

export function setQty(
  entries: CartEntry[],
  id: string,
  qty: number,
  options?: Selection,
): CartEntry[] {
  const key = lineKey(id, options);
  const same = (e: CartEntry) => lineKey(e.id, e.options) === key;
  const next = Math.min(Math.floor(qty), MAX_QTY);
  if (!(next >= 1)) return entries.filter((e) => !same(e));
  if (entries.some(same)) return entries.map((e) => (same(e) ? { ...e, qty: next } : e));
  const sel = cleanSelection(options);
  return [...entries, sel ? { id, qty: next, options: sel } : { id, qty: next }];
}

export function addEntry(
  entries: CartEntry[],
  id: string,
  options?: Selection,
  amount = 1,
): CartEntry[] {
  const key = lineKey(id, options);
  const current = entries.find((e) => lineKey(e.id, e.options) === key)?.qty ?? 0;
  return setQty(entries, id, current + amount, options);
}

/** Price of an item with the chosen options (base price + each option's extra). */
export function priceFor(item: Item, selection?: Selection): number | undefined {
  if (item.price === undefined) return undefined;
  let price = item.price;
  for (const group of item.options ?? []) {
    const label = selection?.[group.name];
    price += group.values.find((v) => v.label === label)?.priceDelta ?? 0;
  }
  return price;
}

/** Lowest possible price (cheapest available choice in each group). */
export function startingPrice(item: Item): number | undefined {
  if (item.price === undefined) return undefined;
  let price = item.price;
  for (const group of item.options ?? []) {
    const deltas = group.values.filter((v) => v.available !== false).map((v) => v.priceDelta ?? 0);
    if (deltas.length > 0) price += Math.min(...deltas);
  }
  return price;
}

/** True when the final price depends on the choices. */
export function hasPriceVariation(item: Item): boolean {
  return (item.options ?? []).some(
    (g) => new Set(g.values.map((v) => v.priceDelta ?? 0)).size > 1,
  );
}

/** One available value picked from every group; undefined when a group is sold out entirely. */
export function defaultSelection(item: Item): Selection | undefined {
  const sel: Selection = {};
  for (const group of item.options ?? []) {
    const first = group.values.find((v) => v.available !== false);
    if (!first) return undefined;
    sel[group.name] = first.label;
  }
  return sel;
}

/** A selection is valid when it picks exactly one existing, available value from every group. */
export function isSelectionValid(item: Item, selection?: Selection): boolean {
  const groups = item.options ?? [];
  const keys = Object.keys(selection ?? {});
  if (keys.length !== groups.length) return false;
  return groups.every((group) => {
    const value = group.values.find((v) => v.label === selection?.[group.name]);
    return Boolean(value) && value?.available !== false;
  });
}

/** Joins the saved entries with the current items. Gone items and no-longer-valid choices are dropped. */
export function resolveLines(items: Item[], entries: CartEntry[]): CartLine[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const lines: CartLine[] = [];
  for (const entry of entries) {
    const item = byId.get(entry.id);
    if (!item || !isSelectionValid(item, entry.options)) continue;
    lines.push({
      key: lineKey(item.id, entry.options),
      id: item.id,
      name: item.name,
      price: priceFor(item, entry.options),
      qty: entry.qty,
      options: (item.options ?? []).map((g) => ({ name: g.name, label: entry.options?.[g.name] ?? "" })),
      selection: entry.options,
    });
  }
  return lines;
}

/** "أسود / L" */
export function optionsText(options: { label: string }[]): string {
  return options.map((o) => o.label).join(" / ");
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + (line.price ?? 0) * line.qty, 0);
}

/** An order can be sent when the cart has items, and delivery has an address. */
export function isOrderReady(lines: CartLine[], customer: Customer): boolean {
  if (lines.length === 0) return false;
  return customer.mode === "pickup" || Boolean(customer.address?.trim());
}

/** The WhatsApp message the shop receives. */
export function buildOrderMessage(input: {
  shopName: string;
  lines: CartLine[];
  currency: string;
  customer: Customer;
}): string {
  const { shopName, lines, currency, customer } = input;
  const rows = lines.map((line) => {
    const price =
      line.price !== undefined ? ` — ${formatPrice(line.price * line.qty, currency)}` : "";
    const opts = line.options.length > 0 ? ` (${optionsText(line.options)})` : "";
    return `• ${line.qty}× ${line.name}${opts}${price}`;
  });

  const out = [`طلب جديد من موقع ${shopName}:`, ...rows];
  if (lines.some((l) => l.price !== undefined)) {
    out.push("", `الإجمالي: ${formatPrice(cartTotal(lines), currency)}`);
  }
  out.push("", `نوع الطلب: ${customer.mode === "delivery" ? "توصيل" : "استلام من المحل"}`);
  if (customer.mode === "delivery") {
    out.push(`العنوان: ${customer.address?.trim() ?? ""}`);
    out.push("(سعر التوصيل يتحدد عند التأكيد)");
  }
  if (customer.name?.trim()) out.push(`الاسم: ${customer.name.trim()}`);
  if (customer.notes?.trim()) out.push(`ملاحظات: ${customer.notes.trim()}`);
  return out.join("\n");
}

/** One product ordered straight from its page (no cart). */
export function buildQuickOrderMessage(input: {
  item: Item;
  selection?: Selection;
  qty: number;
  currency: string;
}): string {
  const { item, selection, qty, currency } = input;
  const groups = item.options ?? [];
  const opts = groups.length
    ? ` (${groups.map((g) => `${g.name}: ${selection?.[g.name] ?? "-"}`).join("، ")})`
    : "";
  const price = priceFor(item, selection);
  const total = price !== undefined ? ` — ${formatPrice(price * qty, currency)}` : "";
  return `مرحبًا، عايز أطلب: ${qty}× ${item.name}${opts}${total}`;
}
