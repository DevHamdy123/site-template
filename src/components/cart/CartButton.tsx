"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

/**
 * Floating "view cart" bar. Only visible once something is in the cart.
 * Phones: a wide bar that leaves room for the WhatsApp button. Larger screens: compact.
 * The outer div only positions; the animation lives on the inner element.
 */
export function CartButton({ currency }: { currency: string }) {
  const { count, total, open } = useCart();
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 start-4 end-24 z-50 sm:end-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <button
          type="button"
          onClick={open}
          aria-label={`عرض السلة، ${count} أصناف`}
          className="flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-primary py-2 ps-5 pe-2 text-primary-foreground shadow-xl hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-w-64"
        >
          <span className="flex items-center gap-3">
            <ShoppingBag size={22} aria-hidden />
            <span className="font-bold">عرض السلة</span>
            <span className="grid size-6 place-items-center rounded-full bg-white/25 text-sm font-bold tabular-nums">
              {count}
            </span>
          </span>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-primary">
            {formatPrice(total, currency)}
          </span>
        </button>
      </motion.div>
    </div>
  );
}
