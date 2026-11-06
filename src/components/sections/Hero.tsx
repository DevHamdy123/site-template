import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/client/site.config";
import type { SectionProps } from "@/config/sections-registry";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { cn, whatsappLink } from "@/lib/utils";

type HeroVariant = "card" | "split" | "full" | "centered";

function resolveVariant(variant?: string): HeroVariant {
  return variant === "split" || variant === "full" || variant === "centered" ? variant : "card";
}

export function Hero({ variant }: SectionProps) {
  const v = resolveVariant(variant);
  const { name, tagline, hero, contact, sections, itemsLabel } = siteConfig;

  const title = hero?.title ?? name;
  const subtitle = hero?.subtitle ?? tagline;
  const image = hero?.image;
  const hasItems = sections.some((s) => s.type === "items");
  // card/full always have a dark background (photo + overlay, or a gradient fallback)
  const onDark = v === "card" || v === "full";
  const centered = v === "centered";

  const text = (
    <div
      className={cn(
        "flex max-w-xl flex-col gap-4 sm:gap-5",
        centered ? "mx-auto items-center text-center" : "items-start",
      )}
    >
      {(hero?.badge || contact.openingHours) && (
        <Reveal immediate className={cn("flex flex-wrap gap-2", centered && "justify-center")}>
          {hero?.badge && (
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-white">
              {hero.badge}
            </span>
          )}
          {contact.openingHours && (
            <OpenBadge openingHours={contact.openingHours} onDark={onDark} />
          )}
        </Reveal>
      )}
      <Reveal immediate delay={0.08}>
        <h1
          className={cn(
            "text-balance text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl xl:text-7xl",
            onDark ? "text-white" : "text-foreground",
          )}
        >
          {title}
        </h1>
      </Reveal>
      <Reveal immediate delay={0.16}>
        <p
          className={cn(
            "text-pretty text-lg sm:text-xl",
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

  // Photo background (with a readable overlay), or a gradient when there is no photo yet.
  const background = image ? (
    <>
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="(min-width: 1280px) 1280px, 100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/10 sm:bg-gradient-to-l sm:from-black/75 sm:via-black/40 sm:to-black/5" />
    </>
  ) : (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary to-accent" />
  );

  if (v === "card") {
    return (
      <section id="hero" className="scroll-mt-20 pt-4 sm:pt-6">
        <Container>
          <div className="relative isolate flex min-h-[28rem] items-end overflow-hidden rounded-card sm:min-h-[32rem] sm:items-center lg:min-h-[36rem]">
            {background}
            <div className="w-full p-6 sm:p-10 lg:p-14">{text}</div>
          </div>
        </Container>
      </section>
    );
  }

  if (v === "full") {
    return (
      <section
        id="hero"
        className="relative isolate flex min-h-[80dvh] scroll-mt-20 items-center overflow-hidden py-16 sm:min-h-[85dvh]"
      >
        {background}
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

  // split
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
              <div className="grid size-full place-items-center text-8xl font-bold text-primary-foreground/90">
                {name.charAt(0)}
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
