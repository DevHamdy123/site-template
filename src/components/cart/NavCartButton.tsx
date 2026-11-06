"use client";

import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

/** Cart button for the navbar: icon + count, and the total on wider screens. */
export function NavCartButton({ currency }: { currency: string }) {
  const { count, total, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? `السلة، ${count} أصناف` : "السلة"}
      className="relative inline-flex h-11 items-center gap-2 rounded-full border border-border px-3 transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <ShoppingBag size={22} aria-hidden />
      {count > 0 && (
        <>
          <span className="absolute -end-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-xs font-bold text-white tabular-nums">
            {count}
          </span>
          <span className="hidden text-sm font-bold text-primary sm:inline">
            {formatPrice(total, currency)}
          </span>
        </>
      )}
    </button>
  );
}
