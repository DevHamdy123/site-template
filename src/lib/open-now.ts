import type { OpeningHours } from "@/config/schema";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Current weekday (0 = Sunday) and minutes since midnight in the shop's timezone. */
function localParts(now: Date, timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    day: Math.max(0, WEEKDAYS.indexOf(get("weekday"))),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/** True when the shop is open at `now`. Handles closing after midnight (e.g. 09:00 -> 00:00 or 02:00). */
export function isOpenNow(hours: OpeningHours, now: Date = new Date()): boolean {
  const open = toMinutes(hours.open);
  const closeRaw = toMinutes(hours.close);
  // close <= open means it closes on the next day
  const close = closeRaw <= open ? closeRaw + 1440 : closeRaw;
  const days = hours.days ?? [0, 1, 2, 3, 4, 5, 6];
  const { day, minutes } = localParts(now, hours.timezone);

  if (minutes >= open && minutes < close) return days.includes(day);
  // after midnight, still inside yesterday's opening window
  if (close > 1440 && minutes + 1440 < close) return days.includes((day + 6) % 7);
  return false;
}
