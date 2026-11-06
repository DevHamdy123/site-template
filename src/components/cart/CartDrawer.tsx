"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Trash2, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { buildOrderMessage, isOrderReady, type OrderMode } from "@/lib/cart/cart";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";
import { useCart } from "./CartProvider";

type CartDrawerProps = { shopName: string; currency: string; whatsapp: string };

const field =
  "min-h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-base outline-none transition focus:border-primary";

const MODES: { value: OrderMode; label: string }[] = [
  { value: "pickup", label: "استلام من المحل" },
  { value: "delivery", label: "توصيل" },
];

/** Cart panel: bottom sheet on phones, side panel on larger screens. */
export function CartDrawer({ shopName, currency, whatsapp }: CartDrawerProps) {
  const { lines, total, isOpen, close, setQuantity, clear } = useCart();
  const [mode, setMode] = useState<OrderMode>("pickup");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Escape closes it, and the page behind does not scroll while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const customer = { mode, name, address, notes };
  const ready = isOrderReady(lines, customer);
  const href = ready
    ? whatsappLink(whatsapp, buildOrderMessage({ shopName, lines, currency, customer }))
    : undefined;

  return (
    <>
      <div aria-hidden onClick={close} className="cart-fade fixed inset-0 z-[60] bg-black/50" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="سلة الطلب"
        className="cart-pop fixed bottom-0 start-0 end-0 z-[70] flex max-h-[92dvh] flex-col rounded-t-3xl bg-background shadow-2xl sm:inset-y-0 sm:start-auto sm:end-0 sm:max-h-none sm:w-[26rem] sm:rounded-none sm:rounded-s-3xl"
      >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-xl font-bold">سلة الطلب</h2>
              <button
                type="button"
                onClick={close}
                aria-label="إغلاق السلة"
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
              >
                <X size={22} aria-hidden />
              </button>
            </div>

            {lines.length === 0 ? (
              <p className="px-5 py-16 text-center text-muted-foreground">السلة فاضية.</p>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="flex flex-col gap-3">
                    {lines.map((line) => (
                      <li key={line.id} className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold">{line.name}</p>
                          {line.price !== undefined && (
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(line.price * line.qty, currency)}
                            </p>
                          )}
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full border border-border p-0.5">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.id, line.qty - 1)}
                            aria-label={line.qty === 1 ? `احذف ${line.name}` : `قلّل ${line.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-full bg-muted hover:bg-border"
                          >
                            {line.qty === 1 ? (
                              <Trash2 size={16} aria-hidden />
                            ) : (
                              <span aria-hidden className="text-lg leading-none">−</span>
                            )}
                          </button>
                          <span className="min-w-6 text-center font-bold tabular-nums">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.id, line.qty + 1)}
                            aria-label={`زوّد ${line.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
                          >
                            <span aria-hidden className="text-lg leading-none">+</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col gap-4">
                    <div role="group" aria-label="نوع الطلب" className="grid grid-cols-2 gap-2">
                      {MODES.map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          aria-pressed={mode === m.value}
                          onClick={() => setMode(m.value)}
                          className={cn(
                            "min-h-11 rounded-full border px-3 text-sm font-semibold transition",
                            mode === m.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:bg-muted",
                          )}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {mode === "delivery" && (
                      <div>
                        <label htmlFor="cart-address" className="mb-1 block text-sm font-semibold">
                          العنوان
                        </label>
                        <input
                          id="cart-address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="الشارع، المنطقة، علامة مميزة"
                          autoComplete="street-address"
                          className={field}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          سعر التوصيل بيتحدد عند تأكيد الطلب.
                        </p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="cart-name" className="mb-1 block text-sm font-semibold">
                        الاسم (اختياري)
                      </label>
                      <input
                        id="cart-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        className={field}
                      />
                    </div>

                    <div>
                      <label htmlFor="cart-notes" className="mb-1 block text-sm font-semibold">
                        ملاحظات (اختياري)
                      </label>
                      <textarea
                        id="cart-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className={cn(field, "resize-none")}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">{formatPrice(total, currency)}</span>
                  </div>
                  {href ? (
                    <ButtonLink href={href} target="_blank" rel="noopener noreferrer" className="w-full">
                      <MessageCircle size={20} aria-hidden />
                      أرسل الطلب عبر واتساب
                    </ButtonLink>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-muted px-6 py-3 text-base font-bold text-muted-foreground"
                    >
                      اكتب عنوان التوصيل
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clear}
                    className="text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    تفريغ السلة
                  </button>
                </div>
              </>
            )}
      </div>
    </>
  );
}
