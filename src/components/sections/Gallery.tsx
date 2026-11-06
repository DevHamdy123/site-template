import Image from "next/image";
import { siteConfig } from "@/client/site.config";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SECTION_LABELS } from "@/config/section-labels";

/** Photo gallery. Renders nothing when `gallery` is empty in site.config. */
export function Gallery() {
  const photos = siteConfig.gallery ?? [];
  if (photos.length === 0) return null;

  return (
    <Section id="gallery">
      <Reveal>
        <h2 className="text-3xl font-bold sm:text-4xl">{SECTION_LABELS.gallery}</h2>
      </Reveal>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <Reveal delay={(i % 4) * 0.06}>
              <div className="relative aspect-square overflow-hidden rounded-card bg-muted">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
