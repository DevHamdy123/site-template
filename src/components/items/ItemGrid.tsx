import Image from "next/image";
import { MessageCircle } from "lucide-react";
import type { Item } from "@/config/schema";
import { AddToCart } from "@/components/cart/AddToCart";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { formatPrice, whatsappLink } from "@/lib/utils";

type ItemGridProps = {
  items: Item[];
  currency: string;
  whatsapp: string;
  /** Replace the per-item WhatsApp button with add-to-cart (site.config features.cart) */
  cartEnabled?: boolean;
};

/** Product style: photo cards with price and a WhatsApp order button per item. */
export function ItemGrid({ items, currency, whatsapp, cartEnabled }: ItemGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item, index) => (
        <li key={item.id}>
          <Reveal delay={(index % 4) * 0.06} className="h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-background">
              <div className="relative aspect-[4/5] bg-muted">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
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
                <h3 className="text-base font-bold leading-snug sm:text-lg">{item.name}</h3>
                {item.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                )}
                <div className="mt-auto flex flex-col gap-3 pt-3">
                  {item.price !== undefined && (
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(item.price, currency)}
                    </p>
                  )}
                  {cartEnabled ? (
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
      ))}
    </ul>
  );
}
