import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/client/site.config";
import type { SectionProps } from "@/config/sections-registry";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn, whatsappLink } from "@/lib/utils";

type HeroVariant = "split" | "full" | "centered";

function resolveVariant(variant?: string): HeroVariant {
  return variant === "full" || variant === "centered" ? variant : "split";
}

export function Hero({ variant }: SectionProps) {
  const v = resolveVariant(variant);
  const { name, tagline, hero, contact, sections, itemsLabel } = siteConfig;

  const title = hero?.title ?? name;
  const subtitle = hero?.subtitle ?? tagline;
  const image = hero?.image;
  const hasItems = sections.some((s) => s.type === "items");
  const onDark = v === "full";
  const centered = v === "centered" || v === "full";

  const text = (
    <div className={cn("flex flex-col gap-5", centered ? "items-center text-center" : "items-start")}>
      {hero?.badge && (
        <Reveal immediate>
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-white">
            {hero.badge}
          </span>
        </Reveal>
      )}
      <Reveal immediate delay={0.08}>
        <h1
          className={cn(
            "text-balance text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl",
            onDark ? "text-white" : "text-foreground",
          )}
        >
          {title}
        </h1>
      </Reveal>
      <Reveal immediate delay={0.16}>
        <p
          className={cn(
            "max-w-xl text-pretty text-lg sm:text-xl",
            onDark ? "text-white/85" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      </Reveal>
      <Reveal immediate delay={0.24} className="flex flex-wrap gap-3">
        <ButtonLink
          href={whatsappLink(contact.whatsapp, `مرحبًا، عايز أستفسر عن ${name}`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={20} aria-hidden />
          {hero?.ctaLabel ?? "اطلب عبر واتساب"}
        </ButtonLink>
        {hasItems && (
          <ButtonLink
            href="#items"
            variant="outline"
            className={onDark ? "border-white/50 text-white hover:bg-white/10" : undefined}
          >
            {hero?.secondaryCtaLabel ?? `استعرض ${itemsLabel}`}
          </ButtonLink>
        )}
      </Reveal>
    </div>
  );

  if (v === "full") {
    return (
      <section id="hero" className="relative isolate flex min-h-[70dvh] scroll-mt-20 items-center overflow-hidden py-16">
        {image ? (
          <>
            <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-black/55" />
          </>
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary to-accent" />
        )}
        <Container>{text}</Container>
      </section>
    );
  }

  if (v === "centered") {
    return (
      <section id="hero" className="scroll-mt-20 bg-secondary py-16 sm:py-24 lg:py-32">
        <Container>{text}</Container>
      </section>
    );
  }

  // split (default)
  return (
    <section id="hero" className="scroll-mt-20 py-12 sm:py-16 lg:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {text}
        <Reveal immediate delay={0.2}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-gradient-to-br from-primary to-accent shadow-lg">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center text-8xl font-extrabold text-primary-foreground/90">
                {name.charAt(0)}
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
