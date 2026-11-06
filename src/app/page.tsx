import { siteConfig } from "@/client/site.config";
import { getNavLinks } from "@/config/nav";
import { sectionRegistry } from "@/config/sections-registry";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { NavCartButton } from "@/components/cart/NavCartButton";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SectionPlaceholder } from "@/components/SectionPlaceholder";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getItems } from "@/lib/data/items";
import { buildJsonLd, getSiteUrl, serializeJsonLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/utils";

export default async function Home() {
  const { name, contact, currency, features } = siteConfig;
  const whatsappHref = whatsappLink(contact.whatsapp, `مرحبًا، عايز أستفسر عن ${name}`);
  const links = getNavLinks(siteConfig);
  const jsonLd = serializeJsonLd(buildJsonLd(siteConfig, getSiteUrl()));

  const page = (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Navbar
        name={name}
        links={links}
        whatsappHref={whatsappHref}
        cart={features.cart ? <NavCartButton currency={currency} /> : undefined}
      />
      <main>
        {siteConfig.sections.map((section, index) => {
          const Component = sectionRegistry[section.type];
          return Component ? (
            <Component key={index} variant={section.variant} />
          ) : (
            <SectionPlaceholder key={index} type={section.type} />
          );
        })}
      </main>
      <Footer name={name} tagline={siteConfig.tagline} links={links} />
      <WhatsAppFab href={whatsappHref} />
    </>
  );

  // The cart exists only for clients who have `features.cart: true`.
  if (!features.cart) return page;

  const items = await getItems();
  return (
    <CartProvider items={items}>
      {page}
      <CartDrawer shopName={name} currency={currency} whatsapp={contact.whatsapp} />
    </CartProvider>
  );
}
