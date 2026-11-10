import { defineItems } from "@/config/schema";

/** ★ Client file — products / services / menu items. Example data (a fictional café). */
const shot = {
  name: "النوع",
  values: [{ label: "سنجل" }, { label: "دوبل", priceDelta: 15 }],
};


const sizes = {
  name: "الحجم",
  values: [{ label: "صغير" }, { label: "وسط", priceDelta: 10 }, { label: "كبير", priceDelta: 20 }],
};

export const items = defineItems([
  { id: "espresso", name: "إسبريسو", description: "شوت مركّز من بن مخصوص", category: "قهوة ساخنة", price: 35, image: "/images/gallery-6.webp", options: [shot] },
  { id: "americano", name: "أمريكانو", category: "قهوة ساخنة", price: 40, options: [sizes] },
  { id: "latte", name: "لاتيه", description: "إسبريسو مع حليب مبخّر ورغوة ناعمة", category: "قهوة ساخنة", price: 55, badge: "الأكثر طلبًا", image: "/images/gallery-4.webp", options: [sizes] },
  { id: "cappuccino", name: "كابتشينو", category: "قهوة ساخنة", price: 55, options: [sizes] },
  { id: "iced-latte", name: "آيس لاتيه", description: "لاتيه بارد مع ثلج", category: "قهوة باردة", price: 60, image: "/images/gallery-2.webp", options: [sizes] },
  { id: "cold-brew", name: "كولد برو", description: "مُخمّر ببطء لمدة 12 ساعة", category: "قهوة باردة", price: 65, options: [sizes] },
  { id: "iced-mocha", name: "آيس موكا", category: "قهوة باردة", price: 70, options: [sizes] },
  { id: "cheesecake", name: "تشيز كيك", description: "بصوص التوت", category: "حلويات", price: 70, badge: "جديد", image: "/images/gallery-1.webp", options: [{ name: "الصوص", values: [{ label: "توت" }, { label: "فراولة" }, { label: "مانجو" }] }] },
  { id: "brownie", name: "براوني", description: "شوكولاتة غامقة مع مكسرات", category: "حلويات", price: 55, image: "/images/gallery-5.webp", options: [{ name: "الإضافة", values: [{ label: "سادة" }, { label: "مع آيس كريم", priceDelta: 20 }] }] },
  { id: "croissant", name: "كرواسون بالزبدة", category: "حلويات", price: 45, image: "/images/gallery-3.webp", options: [{ name: "الحشو", values: [{ label: "سادة" }, { label: "جبنة", priceDelta: 10 }, { label: "شوكولاتة", priceDelta: 10 }] }] },
  { id: "lemon-mint", name: "ليمون بالنعناع", category: "مشروبات", price: 40, options: [sizes] },
  { id: "fresh-orange", name: "عصير برتقال طازج", category: "مشروبات", price: 50, options: [sizes] },
]);
