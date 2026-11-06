import { siteConfig } from "@/client/site.config";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SECTION_LABELS } from "@/config/section-labels";
import { whatsappLink } from "@/lib/utils";

/** Promotions. Renders nothing when `offers` is empty in site.config. */
export function Offers() {
  const offers = siteConfig.offers ?? [];
  if (offers.length === 0) return null;

  return (
    <Section id="offers" className="bg-secondary">
      <Reveal>
        <h2 className="text-3xl font-bold sm:text-4xl">{SECTION_LABELS.offers}</h2>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer, i) => (
          <Reveal key={offer.title} delay={i * 0.08} className="h-full">
            <article className="flex h-full flex-col gap-3 rounded-card border border-border bg-background p-6">
              {offer.badge && (
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                  {offer.badge}
                </span>
              )}
              <h3 className="text-xl font-bold">{offer.title}</h3>
              {offer.description && <p className="text-muted-foreground">{offer.description}</p>}
              <ButtonLink
                href={whatsappLink(siteConfig.contact.whatsapp, `مرحبًا، عايز أستفيد من عرض: ${offer.title}`)}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="mt-auto min-h-10 w-full px-4 py-2 text-sm"
              >
                استفد من العرض
              </ButtonLink>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
