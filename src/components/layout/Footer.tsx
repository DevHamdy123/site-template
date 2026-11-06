import { Container } from "@/components/ui/Container";
import type { NavLink } from "@/config/nav";

type FooterProps = { name: string; tagline: string; links: NavLink[] };

export function Footer({ name, tagline, links }: FooterProps) {
  return (
    <footer className="border-t border-border bg-secondary pb-24 pt-10 sm:pb-10">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <p className="text-2xl font-extrabold text-primary">{name}</p>
            <p className="mt-1 max-w-sm text-muted-foreground">{tagline}</p>
          </div>
          <nav aria-label="روابط التذييل" className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="font-semibold hover:text-primary">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} {name}. جميع الحقوق محفوظة.
        </p>
      </Container>
    </footer>
  );
}
