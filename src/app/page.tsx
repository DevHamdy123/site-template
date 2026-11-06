import { siteConfig } from "@/client/site.config";
import { getNavLinks } from "@/config/nav";
import { sectionRegistry } from "@/config/sections-registry";
import { Navbar } from "@/components/layout/Navbar";
import { SectionPlaceholder } from "@/components/SectionPlaceholder";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { whatsappLink } from "@/lib/utils";

export default function Home() {
  const whatsappHref = whatsappLink(siteConfig.contact.whatsapp, `مرحبًا، عايز أستفسر عن ${siteConfig.name}`);

  return (
    <>
      <Navbar name={siteConfig.name} links={getNavLinks(siteConfig)} whatsappHref={whatsappHref} />
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
      <WhatsAppFab href={whatsappHref} />
    </>
  );
}
