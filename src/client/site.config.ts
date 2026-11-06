import { defineSiteConfig } from "@/config/schema";
import { themes } from "@/config/themes";

/**
 * ★ Client file — the main thing that changes per shop.
 * Example data below (a fictional café). Replace for each client.
 */
export const siteConfig = defineSiteConfig({
  name: "مقهى النيل",
  tagline: "قهوة مظبوطة وقعدة هادية في قلب المنصورة",
  description: "مقهى النيل: مشروبات وحلويات ومكان مريح. اطلب أو تواصل معنا على واتساب.",
  itemsLabel: "المنيو",
  currency: "ج.م",
  theme: themes.warm, // try themes.midnight or themes.fresh
  seo: {
    businessType: "CafeOrCoffeeShop", // LocalBusiness | Restaurant | BeautySalon | ClothingStore | ...
    keywords: ["مقهى المنصورة", "قهوة", "حلويات", "كافيه"],
    // ogImage: "/images/og.webp", // default: the hero image
  },
  hero: {
    badge: "عرض الخريف · خصم 15% على الحلويات",
    secondaryCtaLabel: "شوف المنيو",
    image: "/images/hero.webp", // file lives in public/images/
  },
  highlights: [
    { label: "مواعيد العمل", value: "يوميًا من 9 ص إلى 12 م" },
    { label: "التوصيل", value: "متاح داخل المنصورة" },
    { label: "جديد هذا الأسبوع", value: "تشيز كيك الفستق" },
  ],
  about: {
    title: "قصتنا",
    text: "بدأنا بحلم بسيط: مكان هادي في قلب المنصورة تقعد فيه تشرب قهوة مظبوطة وتحس إنك في بيتك.\nبنحمّص البن بنفسنا ونحضّر الحلويات يوميًا طازجة.",
    points: ["بن مُحمّص طازج", "حلويات يومية", "جلسات هادية", "واي فاي مجاني"],
    image: "/images/about.webp",
  },
  offers: [
    { title: "خصم 15% على الحلويات", description: "على كل الحلويات طوال الأسبوع.", badge: "ينتهي قريبًا" },
    { title: "قهوة + حلوى", description: "أي قهوة ساخنة مع قطعة حلوى بسعر مميز." },
    { title: "عرض الطلبة", description: "خصم 10% بكارنيه الجامعة." },
  ],
  gallery: [
    { src: "/images/gallery-1.webp", alt: "قطعة كيك" },
    { src: "/images/gallery-2.webp", alt: "آيس كوفي" },
    { src: "/images/gallery-3.webp", alt: "معجنات طازجة" },
    { src: "/images/gallery-4.webp", alt: "تحضير القهوة" },
    { src: "/images/gallery-5.webp", alt: "حلوى الشوكولاتة" },
    { src: "/images/gallery-6.webp", alt: "ماكينة الإسبريسو" },
  ], // 4, 6 or 8 photos fill the grid best
  contact: {
    whatsapp: "201000000000",
    phone: "01000000000",
    address: "شارع الجمهورية، المنصورة",
    hours: "يوميًا من 9 ص إلى 12 م",
    openingHours: { open: "09:00", close: "00:00" }, // days: [0..6] (0 = Sunday), timezone: "Africa/Cairo"
    // mapUrl: "https://maps.app.goo.gl/...",            // opens Google Maps
    // mapEmbedUrl: "https://www.google.com/maps/embed?pb=...", // shows the map inside the page
    // social: { instagram: "https://instagram.com/your-page", facebook: "https://facebook.com/your-page" },
  },
  sections: [
    { type: "hero", variant: "card" }, // card | full | split | centered
    { type: "highlights" },
    { type: "about" },
    { type: "items", variant: "menu" }, // menu (cafe) | grid (products with photos)
    { type: "offers" },
    { type: "gallery" },
    { type: "contact" },
  ],
  features: { cart: true }, // order cart + WhatsApp message (false = simple site)
});
