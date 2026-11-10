import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Item } from "@/config/schema";
import { AddToCart } from "@/components/cart/AddToCart";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink, buttonClasses } from "@/components/ui/ButtonLink";
import { hasPriceVariation, startingPrice } from "@/lib/cart/cart";
import { formatPrice, whatsappLink } from "@/lib/utils";

type ItemGridProps = {
  items: Item[];
  currency: string;
  whatsapp: string;
  /** Replace the per-item WhatsApp button with add-to-cart (site.config features.cart) */
  cartEnabled?: boolean;
  /** Cards link to /products/[id] (site.config features.productPages) */
  productPages?: boolean;
};

/** Product style: photo cards with price and a WhatsApp order button per item. */
export function ItemGrid({ items, currency, whatsapp, cartEnabled, productPages }: ItemGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item, index) => {
        const href = `/products/${encodeURIComponent(item.id)}`;
        const hasOptions = Boolean(productPages && item.options?.length);
        const from = startingPrice(item);
        return (
        <li key={item.id}>
          <Reveal delay={(index % 4) * 0.06} className="h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-background">
              <div className="group relative aspect-[4/5] overflow-hidden bg-muted">
                {productPages && (
                  <Link href={href} aria-label={item.name} className="absolute inset-0 z-10" />
                )}
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-5xl font-bold text-muted-foreground/50">
                    {item.name.charAt(0)}
                  </div>
                )}
                {item.badge && (
                  <span className="absolute start-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                <p className="text-xs text-muted-foreground">{item.category}</p>
                <h3 className="text-base font-bold leading-snug sm:text-lg">
                  {productPages ? (
                    <Link href={href} className="hover:text-primary">
                      {item.name}
                    </Link>
                  ) : (
                    item.name
                  )}
                </h3>
                {item.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                )}
                <div className="mt-auto flex flex-col gap-3 pt-3">
                  {from !== undefined && (
                    <p className="text-lg font-bold text-primary">
                      {productPages && hasPriceVariation(item) && (
                        <span className="me-1 text-xs font-semibold text-muted-foreground">يبدأ من</span>
                      )}
                      {formatPrice(from, currency)}
                    </p>
                  )}
                  {hasOptions ? (
                    <Link
                      href={href}
                      className={buttonClasses("outline", "min-h-10 w-full px-3 py-2 text-sm")}
                    >
                      اختر اللون والمقاس
                    </Link>
                  ) : cartEnabled ? (
                    <AddToCart item={item} variant="full" />
                  ) : (
                    <ButtonLink
                      href={whatsappLink(whatsapp, `مرحبًا، عايز أطلب: ${item.name}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-10 w-full px-3 py-2 text-sm"
                    >
                      <MessageCircle size={16} aria-hidden />
                      اطلب عبر واتساب
                    </ButtonLink>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        </li>
        );
      })}
    </ul>
  );
}
