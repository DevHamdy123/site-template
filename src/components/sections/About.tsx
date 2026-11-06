import Image from "next/image";
import { Check } from "lucide-react";
import { siteConfig } from "@/client/site.config";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/** About the shop. Renders nothing when `about` is missing in site.config. */
export function About() {
  const about = siteConfig.about;
  if (!about) return null;

  return (
    <Section id="about">
      <div className={cn("grid items-center gap-10", about.image && "lg:grid-cols-2 lg:gap-16")}>
        <Reveal>
          <h2 className="text-3xl font-bold sm:text-4xl">{about.title ?? "عن المحل"}</h2>
          <p className="mt-4 max-w-2xl whitespace-pre-line text-lg leading-8 text-muted-foreground">
            {about.text}
          </p>
          {about.points && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {about.points.map((point) => (
                <li key={point} className="flex items-center gap-2 font-semibold">
                  <span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check size={14} aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
        {about.image && (
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-muted">
              <Image
                src={about.image}
                alt={siteConfig.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
