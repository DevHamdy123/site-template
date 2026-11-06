import { defineItems } from "@/config/schema";

/** ★ Client file — products / services / menu items. Example data (a fictional café). */
export const items = defineItems([
  { id: "espresso", name: "إسبريسو", description: "شوت مركّز من بن مخصوص", category: "قهوة ساخنة", price: 35 },
  { id: "americano", name: "أمريكانو", category: "قهوة ساخنة", price: 40 },
  { id: "latte", name: "لاتيه", description: "إسبريسو مع حليب مبخّر ورغوة ناعمة", category: "قهوة ساخنة", price: 55, badge: "الأكثر طلبًا" },
  { id: "cappuccino", name: "كابتشينو", category: "قهوة ساخنة", price: 55 },
  { id: "iced-latte", name: "آيس لاتيه", description: "لاتيه بارد مع ثلج", category: "قهوة باردة", price: 60 },
  { id: "cold-brew", name: "كولد برو", description: "مُخمّر ببطء لمدة 12 ساعة", category: "قهوة باردة", price: 65 },
  { id: "iced-mocha", name: "آيس موكا", category: "قهوة باردة", price: 70 },
  { id: "cheesecake", name: "تشيز كيك", description: "بصوص التوت", category: "حلويات", price: 70, badge: "جديد" },
  { id: "brownie", name: "براوني", description: "شوكولاتة غامقة مع مكسرات", category: "حلويات", price: 55 },
  { id: "croissant", name: "كرواسون بالزبدة", category: "حلويات", price: 45 },
  { id: "lemon-mint", name: "ليمون بالنعناع", category: "مشروبات", price: 40 },
  { id: "fresh-orange", name: "عصير برتقال طازج", category: "مشروبات", price: 50 },
]);
