import { siteConfig } from "@/client/site.config";
import { sectionRegistry } from "@/config/sections-registry";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionPlaceholder } from "@/components/SectionPlaceholder";
import { buildJsonLd, getSiteUrl, serializeJsonLd } from "@/lib/seo";

export default function Home() {
  const jsonLd = serializeJsonLd(buildJsonLd(siteConfig, getSiteUrl()));

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
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
    </SiteShell>
  );
}
