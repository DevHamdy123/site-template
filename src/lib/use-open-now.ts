"use client";

import { useEffect, useState } from "react";
import type { OpeningHours } from "@/config/schema";
import { isOpenNow } from "@/lib/open-now";

/**
 * true / false once the browser knows the time; null before that (and when the shop has no hours).
 * Computed in the browser so it is always current and matches on first render.
 */
export function useIsOpen(hours?: OpeningHours): boolean | null {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    if (!hours) return;
    const update = () => setOpen(isOpenNow(hours));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  return hours ? open : null;
}
