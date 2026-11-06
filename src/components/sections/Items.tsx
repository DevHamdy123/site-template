import { siteConfig } from "@/client/site.config";
import type { SectionProps } from "@/config/sections-registry";
import { ItemsBrowser } from "@/components/items/ItemsBrowser";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getCategories, getItems } from "@/lib/data/items";

/** Products / services / menu. Variants: "menu" (default, list by category) | "grid" (photo cards). */
export async function Items({ variant }: SectionProps) {
  const [items, categories] = await Promise.all([getItems(), getCategories()]);
  const { itemsLabel, currency, contact } = siteConfig;

  return (
    <Section id="items">
      <Reveal>
        <h2 className="text-3xl font-bold sm:text-4xl">{itemsLabel}</h2>
      </Reveal>
      <ItemsBrowser
        items={items}
        categories={categories}
        variant={variant === "grid" ? "grid" : "menu"}
        currency={currency}
        whatsapp={contact.whatsapp}
        label={itemsLabel}
        cartEnabled={siteConfig.features.cart}
      />
    </Section>
  );
}
