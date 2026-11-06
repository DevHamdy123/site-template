"use client";

import { useEffect, useState } from "react";
import type { OpeningHours } from "@/config/schema";
import { isOpenNow } from "@/lib/open-now";
import { cn } from "@/lib/utils";

/** "Open now / Closed" pill. Computed in the browser so it is always current. */
export function OpenBadge({
  openingHours,
  onDark,
}: {
  openingHours: OpeningHours;
  onDark?: boolean;
}) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenNow(openingHours));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [openingHours]);

  if (open === null) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold",
        onDark ? "bg-white/15 text-white backdrop-blur" : "bg-secondary text-foreground",
      )}
    >
      <span
        aria-hidden
        className={cn("size-2.5 rounded-full", open ? "bg-emerald-400" : "bg-red-400")}
      />
      {open ? "مفتوح الآن" : "مغلق الآن"}
    </span>
  );
}
