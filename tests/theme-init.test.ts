import { describe, expect, it } from "vitest";
import { themeInitScript } from "@/lib/theme-init";

describe("themeInitScript", () => {
  it("follows the device by default", () => {
    expect(themeInitScript()).toContain("prefers-color-scheme");
  });
  it("uses a fixed default when configured", () => {
    const s = themeInitScript("dark");
    expect(s).toContain('t="dark"');
    expect(s).not.toContain("prefers-color-scheme");
  });
});
