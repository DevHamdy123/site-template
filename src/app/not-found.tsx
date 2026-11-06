import { siteConfig } from "@/client/site.config";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center py-16">
      <Container className="flex flex-col items-center gap-5 text-center">
        <p className="text-7xl font-bold text-primary sm:text-8xl">404</p>
        <h1 className="text-2xl font-bold sm:text-3xl">الصفحة دي مش موجودة</h1>
        <p className="max-w-md text-muted-foreground">
          يمكن الرابط اتغيّر أو فيه غلطة في العنوان. ارجع للرئيسية وكمّل مع {siteConfig.name}.
        </p>
        <ButtonLink href="/">الرئيسية</ButtonLink>
      </Container>
    </main>
  );
}
