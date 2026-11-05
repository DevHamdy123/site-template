import { describe, expect, it } from "vitest";
import { formatPrice, whatsappLink } from "@/lib/utils";

describe("utils", () => {
  it("builds a whatsapp link", () => {
    expect(whatsappLink("201000000000")).toBe("https://wa.me/201000000000");
    expect(whatsappLink("201000000000", "مرحبا")).toBe(
      "https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7",
    );
  });

  it("formats a price with currency", () => {
    expect(formatPrice(35, "ج.م")).toContain("ج.م");
  });
});
