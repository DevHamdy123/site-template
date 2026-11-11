import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/client/site.config";
import { PrintButton } from "@/components/ui/PrintButton";
import { buildQrSvg, QR_DEFAULTS } from "@/lib/qr";
import { getSiteUrl } from "@/lib/seo";

// A working page for the owner, not for Google.
export const metadata: Metadata = {
  title: "بوستر QR",
  robots: { index: false, follow: false },
};

/** Printable A4 poster: shop name, a big QR to the site, and a line that invites the customer to scan. */
export default async function QrPage() {
  if (!siteConfig.features.qr) notFound();

  const url = getSiteUrl();
  const svg = await buildQrSvg(url);
  const headline = siteConfig.qr?.headline ?? QR_DEFAULTS.headline;
  const text = siteConfig.qr?.text ?? QR_DEFAULTS.text;
  const logo = siteConfig.qr?.logo;

  return (
    <main data-theme="light" className="min-h-dvh bg-muted py-8 print:bg-white print:py-0">
      <div className="mx-auto flex w-full max-w-[210mm] flex-col items-center gap-6 px-4">
        <div className="flex w-full flex-col items-center gap-6 rounded-3xl bg-background px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14 print:min-h-[297mm] print:justify-center print:rounded-none print:shadow-none">
          <p className="text-3xl font-extrabold text-primary sm:text-5xl">{siteConfig.name}</p>
          <h1 className="text-2xl font-bold sm:text-4xl">{headline}</h1>

          <div className="relative w-full max-w-[22rem] rounded-3xl border-4 border-primary bg-white p-4 sm:max-w-[26rem] print:max-w-[110mm]">
            <div
              role="img"
              aria-label={`رمز QR يفتح ${url}`}
              className="[&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            {logo && (
              <div className="absolute left-1/2 top-1/2 size-[22%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white p-1">
                <Image src={logo} alt="" width={160} height={160} className="size-full object-contain" />
              </div>
            )}
          </div>

          <p className="max-w-md text-lg text-muted-foreground sm:text-2xl">{text}</p>
          <p dir="ltr" className="text-sm text-muted-foreground">
            {url.replace(/^https?:\/\//, "")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 text-center print:hidden">
          <PrintButton />
          <p className="max-w-md text-sm text-muted-foreground">
            الرمز بيفتح عنوان الموقع الحالي. اطبع الملصق بعد ما الدومين النهائي يتحدد، وجرّب تمسحه
            بموبايلك قبل الطباعة.
          </p>
          <Link href="/" className="text-sm font-semibold text-primary underline underline-offset-4">
            الرجوع للموقع
          </Link>
        </div>
      </div>
    </main>
  );
}
