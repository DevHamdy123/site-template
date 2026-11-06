import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("scroll-mt-20 py-12 sm:py-16 lg:py-24", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
