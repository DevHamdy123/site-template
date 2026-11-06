"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import type { Item } from "@/config/schema";
import {
  addEntry,
  cartCount,
  cartTotal,
  parseEntries,
  resolveLines,
  setQty,
  type CartLine,
} from "@/lib/cart/cart";
import { getServerSnapshot, getSnapshot, subscribe, writeEntries } from "@/lib/cart/store";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  qtyOf: (id: string) => number;
  add: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
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
      qtyOf: (id) => entries.find((e) => e.id === id)?.qty ?? 0,
      add: (id) => writeEntries(addEntry(entries, id)),
      setQuantity: (id, qty) => writeEntries(setQty(entries, id, qty)),
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
