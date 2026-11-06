import type { Item } from "@/config/schema";
import { formatPrice } from "@/lib/utils";

/** What we keep in the browser: only ids and quantities. Names/prices are read from the current menu. */
export type CartEntry = { id: string; qty: number };

export type CartLine = { id: string; name: string; price?: number; qty: number };

export type OrderMode = "pickup" | "delivery";

export type Customer = {
  mode: OrderMode;
  name?: string;
  address?: string;
  notes?: string;
};

export const MAX_QTY = 99;

/** Safely reads what was saved in localStorage. Anything unexpected is dropped. */
export function parseEntries(raw: string): CartEntry[] {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    const entries: CartEntry[] = [];
    for (const row of data) {
      if (typeof row !== "object" || row === null) continue;
      const { id, qty } = row as Record<string, unknown>;
      if (typeof id !== "string" || id === "" || seen.has(id)) continue;
      if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1) continue;
      seen.add(id);
      entries.push({ id, qty: Math.min(qty, MAX_QTY) });
    }
    return entries;
  } catch {
    return [];
  }
}

export function setQty(entries: CartEntry[], id: string, qty: number): CartEntry[] {
  const next = Math.min(Math.floor(qty), MAX_QTY);
  if (!(next >= 1)) return entries.filter((e) => e.id !== id);
  return entries.some((e) => e.id === id)
    ? entries.map((e) => (e.id === id ? { ...e, qty: next } : e))
    : [...entries, { id, qty: next }];
}

export function addEntry(entries: CartEntry[], id: string): CartEntry[] {
  const current = entries.find((e) => e.id === id)?.qty ?? 0;
  return setQty(entries, id, current + 1);
}

/** Joins the saved entries with the current items. Items that no longer exist are dropped. */
export function resolveLines(items: Item[], entries: CartEntry[]): CartLine[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const lines: CartLine[] = [];
  for (const entry of entries) {
    const item = byId.get(entry.id);
    if (item) lines.push({ id: item.id, name: item.name, price: item.price, qty: entry.qty });
  }
  return lines;
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
    return `• ${line.qty}× ${line.name}${price}`;
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
