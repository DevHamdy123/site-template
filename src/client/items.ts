import { defineItems } from "@/config/schema";

/** ★ Client file — products / services / menu items. Example data. */
export const items = defineItems([
  { id: "espresso", name: "إسبريسو", category: "قهوة ساخنة", price: 35 },
  { id: "latte", name: "لاتيه", category: "قهوة ساخنة", price: 55, badge: "الأكثر طلبًا" },
  { id: "iced-latte", name: "آيس لاتيه", category: "قهوة باردة", price: 60 },
  { id: "cheesecake", name: "تشيز كيك", category: "حلويات", price: 70 },
]);
