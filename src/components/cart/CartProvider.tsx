"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import type { Item } from "@/config/schema";
import {
  addEntry,
  cartCount,
  cartTotal,
  lineKey,
  parseEntries,
  resolveLines,
  setQty,
  type CartLine,
  type Selection,
} from "@/lib/cart/cart";
import { getServerSnapshot, getSnapshot, subscribe, writeEntries } from "@/lib/cart/store";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  qtyOf: (id: string, options?: Selection) => number;
  add: (id: string, options?: Selection, amount?: number) => void;
  setQuantity: (id: string, qty: number, options?: Selection) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Holds the cart. `items` is the current menu, so prices are always up to date. */
export function CartProvider({ items, children }: { items: Item[]; children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const entries = useMemo(() => parseEntries(raw), [raw]);
  const lines = useMemo(() => resolveLines(items, entries), [items, entries]);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: cartCount(lines),
      total: cartTotal(lines),
      qtyOf: (id, options) => entries.find((e) => lineKey(e.id, e.options) === lineKey(id, options))?.qty ?? 0,
      // Read the saved cart at click time so two quick clicks never overwrite each other.
      add: (id, options, amount = 1) =>
        writeEntries(addEntry(parseEntries(getSnapshot()), id, options, amount)),
      setQuantity: (id, qty, options) =>
        writeEntries(setQty(parseEntries(getSnapshot()), id, qty, options)),
      clear: () => writeEntries([]),
      isOpen,
      open,
      close,
    }),
    [lines, entries, isOpen, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** Same as useCart, but returns null on sites without a cart (features.cart = false). */
export function useOptionalCart(): CartContextValue | null {
  return useContext(CartContext);
}
