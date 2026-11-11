import { siteConfig } from "@/client/site.config";
import { getNavLinks } from "@/config/nav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { NavCartButton } from "@/components/cart/NavCartButton";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getPublicItems } from "@/lib/data/items";
import { whatsappLink } from "@/lib/utils";

type SiteShellProps = {
  children: React.ReactNode;
  /** true on pages other than the home page: nav links go back to "/#section" */
  subpage?: boolean;
};

/** Navbar + cart + footer + WhatsApp button, shared by the home page and the product pages. */
export async function SiteShell({ children, subpage = false }: SiteShellProps) {
  const { name, tagline, contact, currency, features } = siteConfig;
  const whatsappHref = whatsappLink(contact.whatsapp, `مرحبًا، عايز أستفسر عن ${name}`);
  const base = getNavLinks(siteConfig);
  const links = subpage ? base.map((l) => ({ ...l, href: `/${l.href}` })) : base;

  const shell = (
    <>
      <Navbar
        name={name}
        links={links}
        whatsappHref={whatsappHref}
        homeHref={subpage ? "/" : "#hero"}
        cart={features.cart ? <NavCartButton currency={currency} /> : undefined}
      />
      {children}
      <Footer name={name} tagline={tagline} links={links} />
      <WhatsAppFab href={whatsappHref} />
    </>
  );

  // The cart exists only for clients who have `features.cart: true`.
  if (!features.cart) return shell;

  const items = await getPublicItems();
  return (
    <CartProvider items={items}>
      {shell}
      <CartDrawer
        shopName={name}
        currency={currency}
        whatsapp={contact.whatsapp}
        openingHours={contact.openingHours}
      />
    </CartProvider>
  );
}
