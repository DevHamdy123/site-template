import Link from "next/link";
import type { Item } from "@/config/schema";
import { AddToCart } from "@/components/cart/AddToCart";
import { Reveal } from "@/components/ui/Reveal";
import { hasPriceVariation, startingPrice } from "@/lib/cart/cart";
import { cn, formatPrice } from "@/lib/utils";

type MenuListProps = {
  items: Item[];
  categories: string[];
  currency: string;
  /** Show the "+" add-to-cart button (site.config features.cart) */
  cartEnabled?: boolean;
  /** Names link to /products/[id] (site.config features.productPages) */
  productPages?: boolean;
};

/** Cafe/restaurant style: items grouped by category, name ..... price. */
export function MenuList({ items, categories, currency, cartEnabled, productPages }: MenuListProps) {
  const groups = categories
    .map((category) => ({ category, items: items.filter((i) => i.category === category) }))
    .filter((g) => g.items.length > 0);

  // With a single category selected, lay its items out in two columns instead of leaving half empty.
  const single = groups.length === 1;

  return (
    <div className={cn("grid gap-10", !single && "lg:grid-cols-2 lg:gap-x-16")}>
      {groups.map((group) => (
        <Reveal key={group.category}>
          <h3 className="mb-4 border-b border-border pb-2 text-2xl font-bold text-primary">
            {group.category}
          </h3>
          <ul className={cn("flex flex-col gap-5", single && "lg:grid lg:grid-cols-2 lg:gap-x-16")}>
            {group.items.map((item) => {
              const href = `/products/${encodeURIComponent(item.id)}`;
              const hasOptions = Boolean(productPages && item.options?.length);
              const from = startingPrice(item);
              return (
              <li key={item.id}>
                <div className={cn("flex gap-3", cartEnabled ? "items-center" : "items-baseline")}>
                  <span className="text-lg font-bold">
                    {productPages ? (
                      <Link href={href} className="hover:text-primary">
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                  <span aria-hidden className="flex-1 -translate-y-1 border-b-2 border-dotted border-muted-foreground/40" />
                  {from !== undefined && (
                    <span className="whitespace-nowrap text-lg font-bold text-primary">
                      {productPages && hasPriceVariation(item) && (
                        <span className="me-1 text-xs font-semibold text-muted-foreground">من</span>
                      )}
                      {formatPrice(from, currency)}
                    </span>
                  )}
                  {cartEnabled &&
                    (hasOptions ? (
                      <Link
                        href={href}
                        className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-border px-4 text-sm font-bold transition hover:bg-muted"
                      >
                        اختر
                      </Link>
                    ) : (
                      <AddToCart item={item} />
                    ))}
                </div>
                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                )}
              </li>
              );
            })}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
