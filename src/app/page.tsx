import { siteConfig } from "@/client/site.config";
import { sectionRegistry } from "@/config/sections-registry";
import { SectionPlaceholder } from "@/components/SectionPlaceholder";

export default function Home() {
  return (
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
  );
}
