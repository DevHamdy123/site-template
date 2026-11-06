import type { Item } from "@/config/schema";
import { Reveal } from "@/components/ui/Reveal";
import { formatPrice } from "@/lib/utils";

type MenuListProps = { items: Item[]; categories: string[]; currency: string };

/** Cafe/restaurant style: items grouped by category, name ..... price. */
export function MenuList({ items, categories, currency }: MenuListProps) {
  const groups = categories
    .map((category) => ({ category, items: items.filter((i) => i.category === category) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-16">
      {groups.map((group) => (
        <Reveal key={group.category}>
          <h3 className="mb-4 border-b border-border pb-2 text-2xl font-bold text-primary">
            {group.category}
          </h3>
          <ul className="flex flex-col gap-5">
            {group.items.map((item) => (
              <li key={item.id}>
                <div className="flex items-baseline gap-3">
                  <span className="text-lg font-bold">{item.name}</span>
                  {item.badge && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                  <span aria-hidden className="flex-1 -translate-y-1 border-b border-dotted border-border" />
                  {item.price !== undefined && (
                    <span className="whitespace-nowrap text-lg font-bold text-primary">
                      {formatPrice(item.price, currency)}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
