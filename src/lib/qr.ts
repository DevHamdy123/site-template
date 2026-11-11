import QRCode from "qrcode";

/**
 * QR code as an SVG string. Error correction "H" survives a logo covering the middle
 * and a slightly worn sticker.
 */
export async function buildQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });
}

export const QR_DEFAULTS = {
  headline: "المحل مقفول؟ اطلب من موبايلك",
  text: "امسح الكود وشوف منتجاتنا وعروضنا واطلب أونلاين",
} as const;
