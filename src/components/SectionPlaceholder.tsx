import { Section } from "@/components/ui/Section";

/** Shown for sections listed in site.config that are not built yet. */
export function SectionPlaceholder({ type }: { type: string }) {
  return (
    <Section className="border-b border-border">
      <div className="rounded-card border border-dashed border-border bg-muted p-6 text-center">
        <p className="text-sm text-muted-foreground">قسم قيد البناء</p>
        <p className="mt-1 text-xl font-bold text-foreground">{type}</p>
      </div>
    </Section>
  );
}
