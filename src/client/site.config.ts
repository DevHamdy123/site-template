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
  hero: {
    badge: "عرض الخريف · خصم 15% على الحلويات",
    secondaryCtaLabel: "شوف المنيو",
    // image: "/images/hero.jpg",  // put the file in public/images/ then uncomment
  },
  contact: {
    whatsapp: "201000000000",
    phone: "01000000000",
    address: "شارع الجمهورية، المنصورة",
    hours: "يوميًا من 9 ص إلى 12 م",
  },
  sections: [
    { type: "hero", variant: "split" }, // split | full | centered
    { type: "about" },
    { type: "items" },
    { type: "offers" },
    { type: "gallery" },
    { type: "contact" },
  ],
  features: {},
});
