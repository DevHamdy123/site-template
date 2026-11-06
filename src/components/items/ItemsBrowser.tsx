"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Item } from "@/config/schema";
import { filterItems } from "@/lib/items-filter";
import { cn } from "@/lib/utils";
import { ItemGrid } from "./ItemGrid";
import { MenuList } from "./MenuList";

type ItemsBrowserProps = {
  items: Item[];
  categories: string[];
  variant: "menu" | "grid";
  currency: string;
  whatsapp: string;
  label: string;
};

const ALL = "__all__";

/** Category filter + search + the list/grid. The only interactive part of the items section. */
export function ItemsBrowser({
  items,
  categories,
  variant,
  currency,
  whatsapp,
  label,
}: ItemsBrowserProps) {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const visible = useMemo(
    () => filterItems(items, category === ALL ? null : category, query),
    [items, category, query],
  );

  const tabs = [{ value: ALL, label: "الكل" }, ...categories.map((c) => ({ value: c, label: c }))];

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="التصنيفات">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                aria-pressed={category === tab.value}
                onClick={() => setCategory(tab.value)}
                className={cn(
                  "min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  category === tab.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative w-full sm:max-w-xs">
          <label htmlFor="items-search" className="sr-only">
            ابحث في {label}
          </label>
          <Search
            size={18}
            aria-hidden
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="items-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`ابحث في ${label}...`}
            className="min-h-11 w-full rounded-full border border-border bg-background ps-11 pe-4 text-base outline-none transition focus:border-primary"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-card border border-dashed border-border bg-muted p-8 text-center text-muted-foreground">
          مفيش نتائج مطابقة لبحثك.
        </p>
      ) : variant === "grid" ? (
        <ItemGrid items={visible} currency={currency} whatsapp={whatsapp} />
      ) : (
        <MenuList items={visible} categories={categories} currency={currency} />
      )}
    </div>
  );
}
