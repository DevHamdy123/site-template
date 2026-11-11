import { defineSiteConfig } from "@/config/schema";
import { themes } from "@/config/themes";

/**
 * ★ Client file — the main thing that changes per shop.
 * Neutral starter content: copy this template, then replace every value for the new client.
 */
export const siteConfig = defineSiteConfig({
  name: "اسم المحل",
  tagline: "جملة قصيرة تعرّف الزبون بالمحل",
  description: "وصف مختصر للمحل في سطرين يظهر في نتائج جوجل ومشاركة الروابط.",
  itemsLabel: "المنتجات", // "المنيو" / "الخدمات" / "المنتجات"
  currency: "ج.م",
  theme: themes.warm, // try themes.midnight or themes.fresh
  seo: {
    businessType: "LocalBusiness", // Restaurant | CafeOrCoffeeShop | BeautySalon | ClothingStore | ...
    keywords: ["كلمة مفتاحية 1", "كلمة مفتاحية 2"],
    // ogImage: "/images/og.webp", // default: the hero image
  },
  hero: {
    badge: "عرض تجريبي · غيّره حسب العميل",
    secondaryCtaLabel: "شوف المنتجات",
    image: "/images/hero.webp", // file lives in public/images/
  },
  highlights: [
    { label: "مواعيد العمل", value: "يوميًا من 10 ص إلى 10 م" },
    { label: "التوصيل", value: "متاح داخل المدينة" },
    { label: "جديد هذا الأسبوع", value: "منتج جديد" },
  ],
  about: {
    title: "عن المحل",
    text: "اكتب هنا قصة المحل في سطرين أو تلاتة.\nمين إحنا، وإيه اللي بيميّزنا عن غيرنا.",
    points: ["ميزة أولى", "ميزة تانية", "ميزة تالتة"],
    image: "/images/about.webp",
  },
  offers: [
    { title: "عرض تجريبي 1", description: "وصف العرض هنا.", badge: "لفترة محدودة" },
    { title: "عرض تجريبي 2", description: "وصف العرض هنا." },
    { title: "عرض تجريبي 3", description: "وصف العرض هنا." },
  ],
  gallery: [
    { src: "/images/gallery-1.webp", alt: "صورة 1" },
    { src: "/images/gallery-2.webp", alt: "صورة 2" },
    { src: "/images/gallery-3.webp", alt: "صورة 3" },
    { src: "/images/gallery-4.webp", alt: "صورة 4" },
    { src: "/images/gallery-5.webp", alt: "صورة 5" },
    { src: "/images/gallery-6.webp", alt: "صورة 6" },
  ], // 4, 6 or 8 photos fill the grid best
  contact: {
    whatsapp: "201000000000", // digits only, with country code (no + and no leading 0)
    phone: "01000000000",
    address: "العنوان هنا، المدينة",
    hours: "يوميًا من 10 ص إلى 10 م",
    openingHours: { open: "10:00", close: "22:00" }, // days: [0..6] (0 = Sunday), timezone: "Africa/Cairo"
    // mapUrl: "https://maps.app.goo.gl/...",            // opens Google Maps
    // mapEmbedUrl: "https://www.google.com/maps/embed?pb=...", // shows the map inside the page
    // social: { instagram: "https://instagram.com/your-page", facebook: "https://facebook.com/your-page" },
  },
  qr: {
    headline: "المحل مقفول؟ اطلب من موبايلك",
    text: "امسح الكود وشوف منتجاتنا وعروضنا واطلب أونلاين",
    // logo: "/images/logo.webp", // square logo shown in the middle of the QR
  },
  sections: [
    { type: "hero", variant: "card" }, // card | full | split | centered
    { type: "highlights" },
    { type: "about" },
    { type: "items", variant: "grid" }, // menu (cafe) | grid (products with photos)
    { type: "offers" },
    { type: "gallery" },
    { type: "contact" },
  ],
  features: {
    cart: true,
    productPages: true,
    qr: true,
    darkMode: true,
  }, // cart + WhatsApp order | productPages = a page per item | qr = printable QR poster at /qr
});
