import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-foreground hover:opacity-90",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
};

type ButtonLinkProps = React.ComponentProps<"a"> & { variant?: Variant };

/** A link styled as a button (all our CTAs are links: WhatsApp, section anchors). */
export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
