import { Clock, ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/client/site.config";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SECTION_LABELS } from "@/config/section-labels";
import { cn, whatsappLink } from "@/lib/utils";

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <div className="text-lg font-bold">{children}</div>
      </div>
    </li>
  );
}

/** Address, hours, phone, WhatsApp, social links and an optional map. */
export function Contact() {
  const { name, contact } = siteConfig;
  const social = [
    { label: "إنستجرام", href: contact.social?.instagram },
    { label: "فيسبوك", href: contact.social?.facebook },
    { label: "تيك توك", href: contact.social?.tiktok },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));
  const hasMap = Boolean(contact.mapEmbedUrl || contact.mapUrl);

  return (
    <Section id="contact" className="bg-muted">
      <div className={cn("grid gap-10", hasMap && "lg:grid-cols-2 lg:gap-16")}>
        <Reveal>
          <h2 className="text-3xl font-bold sm:text-4xl">{SECTION_LABELS.contact}</h2>
          <ul className="mt-8 flex flex-col gap-6">
            {contact.address && (
              <InfoRow icon={<MapPin size={20} aria-hidden />} label="العنوان">
                {contact.address}
              </InfoRow>
            )}
            {contact.hours && (
              <InfoRow icon={<Clock size={20} aria-hidden />} label="مواعيد العمل">
                {contact.hours}
              </InfoRow>
            )}
            {contact.phone && (
              <InfoRow icon={<Phone size={20} aria-hidden />} label="الهاتف">
                <a href={`tel:${contact.phone}`} dir="ltr" className="hover:text-primary">
                  {contact.phone}
                </a>
              </InfoRow>
            )}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href={whatsappLink(contact.whatsapp, `مرحبًا، عايز أستفسر عن ${name}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={20} aria-hidden />
              تواصل عبر واتساب
            </ButtonLink>
            {social.map((s) => (
              <ButtonLink key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" variant="outline">
                {s.label}
                <ExternalLink size={16} aria-hidden />
              </ButtonLink>
            ))}
          </div>
        </Reveal>

        {hasMap && (
          <Reveal delay={0.1}>
            {contact.mapEmbedUrl ? (
              <iframe
                src={contact.mapEmbedUrl}
                title={`خريطة ${name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[4/3] w-full rounded-card border border-border"
              />
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center rounded-card border border-border bg-background p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <MapPin size={40} className="text-primary" aria-hidden />
                  <ButtonLink href={contact.mapUrl} target="_blank" rel="noopener noreferrer">
                    افتح في خرائط جوجل
                    <ExternalLink size={16} aria-hidden />
                  </ButtonLink>
                </div>
              </div>
            )}
          </Reveal>
        )}
      </div>
    </Section>
  );
}
