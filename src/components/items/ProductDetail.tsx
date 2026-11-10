"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import { useOptionalCart } from "@/components/cart/CartProvider";
import { buttonClasses } from "@/components/ui/ButtonLink";
import type { Item } from "@/config/schema";
import {
  MAX_QTY,
  buildQuickOrderMessage,
  defaultSelection,
  isSelectionValid,
  priceFor,
  type Selection,
} from "@/lib/cart/cart";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";

type ProductDetailProps = {
  item: Item;
  currency: string;
  whatsapp: string;
};

const roundBtn =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Everything interactive on a product page: gallery, options, quantity, order buttons. */
export function ProductDetail({ item, currency, whatsapp }: ProductDetailProps) {
  const cart = useOptionalCart();
  const groups = useMemo(() => item.options ?? [], [item.options]);

  // Gallery = main image, extra images, then the photos attached to options.
  const gallery = useMemo(() => {
    const list = [item.image, ...(item.images ?? [])].filter((x): x is string => Boolean(x));
    for (const group of groups) {
      for (const value of group.values) if (value.image) list.push(value.image);
    }
    return Array.from(new Set(list));
  }, [item, groups]);

  const [selection, setSelection] = useState<Selection>(() => defaultSelection(item) ?? {});
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const valid = isSelectionValid(item, selection);
  const soldOut = groups.some((g) => g.values.every((v) => v.available === false));
  const price = priceFor(item, selection);

  function choose(groupName: string, label: string, image?: string) {
    setSelection((prev) => ({ ...prev, [groupName]: label }));
    setAdded(false);
    if (image) {
      const index = gallery.indexOf(image);
      if (index >= 0) setActive(index);
    }
  }

  function addToCart() {
    if (!cart || !valid) return;
    cart.add(item.id, groups.length > 0 ? selection : undefined, qty);
    setAdded(true);
  }

  const whatsappHref = whatsappLink(
    whatsapp,
    buildQuickOrderMessage({ item, selection: valid ? selection : undefined, qty, currency }),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-14">
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 lg:sticky lg:top-24 lg:max-w-lg">
        <div className="relative aspect-square overflow-hidden rounded-card border border-border bg-muted">
          {gallery.length > 0 ? (
            <Image
              key={gallery[active]}
              src={gallery[active]}
              alt={item.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="cart-fade object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center text-7xl font-bold text-muted-foreground/50">
              {item.name.charAt(0)}
            </div>
          )}
          {item.badge && (
            <span className="absolute start-4 top-4 rounded-full bg-accent px-3 py-1 text-sm font-bold text-white">
              {item.badge}
            </span>
          )}
        </div>

        {gallery.length > 1 && (
          <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6">
            {gallery.map((src, index) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`صورة ${index + 1}`}
                  aria-current={index === active}
                  className={cn(
                    "relative block aspect-square w-full overflow-hidden rounded-xl border-2 bg-muted transition",
                    index === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-muted-foreground">{item.category}</p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">{item.name}</h1>
          {price !== undefined && (
            <p className="mt-3 text-2xl font-bold text-primary">{formatPrice(price, currency)}</p>
          )}
          {item.description && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{item.description}</p>
          )}
        </div>

        {groups.map((group) => (
          <div key={group.name} role="group" aria-label={group.name}>
            <p className="mb-2 font-bold">
              {group.name}: <span className="font-semibold text-muted-foreground">{selection[group.name]}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const selected = selection[group.name] === value.label;
                const unavailable = value.available === false;
                if (value.swatch) {
                  return (
                    <button
                      key={value.label}
                      type="button"
                      disabled={unavailable}
                      aria-pressed={selected}
                      aria-label={unavailable ? `${value.label} (غير متاح)` : value.label}
                      onClick={() => choose(group.name, value.label, value.image)}
                      className={cn(
                        "relative inline-flex size-11 items-center justify-center rounded-full border-2 p-1 transition",
                        selected ? "border-primary" : "border-border hover:border-foreground/40",
                        unavailable && "cursor-not-allowed opacity-40",
                      )}
                    >
                      <span
                        className="block size-full rounded-full border border-black/10"
                        style={{ backgroundColor: value.swatch }}
                      />
                      {unavailable && (
                        <span aria-hidden className="absolute inset-x-1 top-1/2 h-0.5 -rotate-45 bg-foreground" />
                      )}
                    </button>
                  );
                }
                return (
                  <button
                    key={value.label}
                    type="button"
                    disabled={unavailable}
                    aria-pressed={selected}
                    onClick={() => choose(group.name, value.label, value.image)}
                    className={cn(
                      "min-h-11 min-w-12 rounded-full border px-4 text-sm font-bold transition",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted",
                      unavailable && "cursor-not-allowed line-through opacity-40 hover:bg-transparent",
                    )}
                  >
                    {value.label}
                    {!unavailable && value.priceDelta ? (
                      <span className="ms-1 text-xs font-semibold opacity-80">
                        {value.priceDelta > 0 ? "+" : "−"}
                        {Math.abs(value.priceDelta)}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {soldOut ? (
          <p className="rounded-card border border-dashed border-border bg-muted p-4 text-center font-semibold">
            المنتج غير متاح حاليًا.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <span className="font-bold">الكمية</span>
              <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setQty((q) => Math.max(1, q - 1));
                    setAdded(false);
                  }}
                  aria-label="قلّل الكمية"
                  className={cn(roundBtn, "bg-muted hover:bg-border")}
                >
                  <Minus size={18} aria-hidden />
                </button>
                <span className="min-w-8 text-center font-bold tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQty((q) => Math.min(MAX_QTY, q + 1));
                    setAdded(false);
                  }}
                  aria-label="زوّد الكمية"
                  className={cn(roundBtn, "bg-primary text-primary-foreground hover:opacity-90")}
                >
                  <Plus size={18} aria-hidden />
                </button>
              </div>
            </div>

            {cart && (
              <button
                type="button"
                onClick={addToCart}
                disabled={!valid}
                className={cn(buttonClasses("primary", "w-full"), "disabled:opacity-50")}
              >
                {added ? <Check size={20} aria-hidden /> : <ShoppingBag size={20} aria-hidden />}
                {added ? "اتضاف للسلة ✓" : "أضف للسلة"}
              </button>
            )}
            {cart && added && (
              <p className="flex items-center justify-between gap-3 rounded-card bg-muted px-4 py-3 text-sm font-semibold">
                <span>كمّل تسوّق، وافتح السلة لما تخلّص.</span>
                <button
                  type="button"
                  onClick={cart.open}
                  className="shrink-0 font-bold text-primary underline underline-offset-4"
                >
                  عرض السلة ({cart.count})
                </button>
              </p>
            )}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!valid}
              className={buttonClasses(cart ? "outline" : "primary", "w-full")}
            >
              <MessageCircle size={20} aria-hidden />
              اطلب عبر واتساب
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
