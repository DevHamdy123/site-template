import { describe, expect, it } from "vitest";
import { getNavLinks } from "@/config/nav";
import { siteConfig } from "@/client/site.config";

describe("getNavLinks", () => {
  it("excludes the hero and links to section anchors", () => {
    const links = getNavLinks(siteConfig);
    expect(links.map((l) => l.href)).not.toContain("#hero");
    expect(links[0]).toEqual({ href: "#about", label: "عن المحل" });
  });

  it("uses itemsLabel for the items section", () => {
    const items = getNavLinks(siteConfig).find((l) => l.href === "#items");
    expect(items?.label).toBe(siteConfig.itemsLabel);
  });

  it("lets a section override its label", () => {
    const links = getNavLinks({
      itemsLabel: "المنتجات",
      sections: [{ type: "hero" }, { type: "offers", label: "الخصومات" }],
    });
    expect(links).toEqual([{ href: "#offers", label: "الخصومات" }]);
  });
});
