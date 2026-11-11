import { defineItems } from "@/config/schema";

/**
 * ★ Client file — products / services / menu items. Neutral starter data.
 * Shows the three kinds of item: with color + size, with size only (price extra), and a plain one.
 * Options (colors/sizes) and extra photos need `features.productPages: true` in site.config.ts.
 */
export const items = defineItems([
  {
    id: "product-1",
    name: "منتج تجريبي 1",
    description: "وصف المنتج هنا. المنتج ده عليه اختيار لون ومقاس.",
    category: "التصنيف الأول",
    price: 300,
    image: "/images/product-1.webp",
    badge: "جديد",
    options: [
      {
        name: "اللون",
        values: [
          { label: "أزرق", swatch: "#3b5b9d", image: "/images/product-1.webp" },
          { label: "أحمر", swatch: "#c0463c", image: "/images/product-1b.webp" },
        ],
      },
      {
        name: "المقاس",
        values: [{ label: "S" }, { label: "M" }, { label: "L" }, { label: "XL", available: false }],
      },
    ],
  },
  {
    id: "product-2",
    name: "منتج تجريبي 2",
    description: "وصف المنتج هنا. المقاس الأكبر بسعر أعلى.",
    category: "التصنيف الأول",
    price: 450,
    image: "/images/product-2.webp",
    options: [
      {
        name: "المقاس",
        values: [{ label: "صغير" }, { label: "وسط", priceDelta: 20 }, { label: "كبير", priceDelta: 40 }],
      },
    ],
  },
  {
    id: "product-3",
    name: "منتج تجريبي 3",
    description: "منتج بسيط من غير خيارات.",
    category: "التصنيف الثاني",
    price: 150,
    image: "/images/product-3.webp",
  },
]);
