import { siteConfig } from "@/client/site.config";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

// Static class names (Tailwind needs to see them): one column per card on wide screens.
const COLUMNS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** Small info cards under the hero. Content comes from `highlights` in site.config. */
export function Highlights() {
  const cards = siteConfig.highlights ?? [];
  if (cards.length === 0) return null;

  return (
    <section id="highlights" className="scroll-mt-20 pt-4 sm:pt-5">
      <Container className={cn("grid grid-cols-1 gap-3 sm:gap-4", COLUMNS[cards.length])}>
        {cards.map((card, i) => (
          <Reveal key={card.label} delay={i * 0.08}>
            <div
              className={cn(
                "h-full rounded-card border p-5 sm:p-6",
                i === 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary text-foreground",
              )}
            >
              <p
                className={cn(
                  "text-sm font-semibold",
                  i === 0 ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {card.label}
              </p>
              <p className="mt-1 text-lg font-bold sm:text-xl">{card.value}</p>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
