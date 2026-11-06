"use client";

import { Minus, Plus } from "lucide-react";
import type { Item } from "@/config/schema";
import { cn } from "@/lib/utils";
import { useCart } from "./CartProvider";

type AddToCartProps = {
  item: Item;
  /** "icon": small round button (menu rows). "full": wide button (product cards). */
  variant?: "icon" | "full";
};

const roundBtn =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** "+" button that turns into a − qty + stepper once the item is in the cart. */
export function AddToCart({ item, variant = "icon" }: AddToCartProps) {
  const { qtyOf, add, setQuantity } = useCart();
  const qty = qtyOf(item.id);
  const full = variant === "full";

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add(item.id)}
        aria-label={`أضف ${item.name} للسلة`}
        className={cn(
          "bg-primary text-primary-foreground hover:opacity-90",
          full
            ? "inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            : roundBtn,
        )}
      >
        <Plus size={full ? 16 : 20} aria-hidden />
        {full && "أضف للسلة"}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`كمية ${item.name}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-background p-0.5",
        full && "w-full justify-between",
      )}
    >
      <button
        type="button"
        onClick={() => setQuantity(item.id, qty - 1)}
        aria-label={`قلّل ${item.name}`}
        className={cn(roundBtn, "bg-muted text-foreground hover:bg-border")}
      >
        <Minus size={18} aria-hidden />
      </button>
      <span className="min-w-6 text-center font-bold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => add(item.id)}
        aria-label={`زوّد ${item.name}`}
        className={cn(roundBtn, "bg-primary text-primary-foreground hover:opacity-90")}
      >
        <Plus size={18} aria-hidden />
      </button>
    </div>
  );
}
