import { describe, expect, it } from "vitest";
import { openingHoursSchema } from "@/config/schema";
import { isOpenNow } from "@/lib/open-now";

const hours = (h: object) => openingHoursSchema.parse(h);
// 2026-11-06 is a Friday. Cairo is UTC+2 in November (no DST), so 10:00 Cairo = 08:00Z.
const cairo = (iso: string) => new Date(`${iso}+02:00`);

describe("isOpenNow", () => {
  const cafe = hours({ open: "09:00", close: "00:00" });

  it("is open during the day", () => {
    expect(isOpenNow(cafe, cairo("2026-11-06T10:00:00"))).toBe(true);
    expect(isOpenNow(cafe, cairo("2026-11-06T23:30:00"))).toBe(true);
  });

  it("is closed before opening", () => {
    expect(isOpenNow(cafe, cairo("2026-11-06T08:59:00"))).toBe(false);
  });

  it("handles closing after midnight", () => {
    const late = hours({ open: "18:00", close: "02:00" });
    expect(isOpenNow(late, cairo("2026-11-07T01:00:00"))).toBe(true);
    expect(isOpenNow(late, cairo("2026-11-07T03:00:00"))).toBe(false);
  });

  it("respects the open days (0 = Sunday)", () => {
    const sunToThu = hours({ open: "09:00", close: "17:00", days: [0, 1, 2, 3, 4] });
    expect(isOpenNow(sunToThu, cairo("2026-11-06T10:00:00"))).toBe(false); // Friday
    expect(isOpenNow(sunToThu, cairo("2026-11-05T10:00:00"))).toBe(true); // Thursday
  });

  it("uses the shop timezone, not the viewer's", () => {
    // 08:30Z = 10:30 in Cairo (open), regardless of where the test runs
    expect(isOpenNow(cafe, new Date("2026-11-06T08:30:00Z"))).toBe(true);
    expect(isOpenNow(cafe, new Date("2026-11-06T06:30:00Z"))).toBe(false); // 08:30 Cairo
  });

  it("rejects bad time strings", () => {
    expect(() => openingHoursSchema.parse({ open: "9am", close: "00:00" })).toThrow();
  });
});
