import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Builds a wa.me link. `number` = digits only with country code. */
export function whatsappLink(number: string, text?: string) {
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function formatPrice(price: number, currency: string) {
  return `${new Intl.NumberFormat("ar-EG").format(price)} ${currency}`;
}
