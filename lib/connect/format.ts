// Display helpers for EFG Connect — shared across pages.

const DATE_LONG = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric",
});
const DATE_SHORT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short",
});
const USD = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
});
const NUMBER = new Intl.NumberFormat("en-GB");

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return DATE_LONG.format(new Date(value));
}

export function formatDateRange(
  start: string,
  end: string | null | undefined,
): string {
  const startDate = new Date(start);
  if (!end || start === end) return DATE_LONG.format(startDate);
  const endDate = new Date(end);
  if (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth()
  ) {
    return `${DATE_SHORT.format(startDate).split(" ")[0]}–${DATE_LONG.format(endDate)}`;
  }
  return `${DATE_SHORT.format(startDate)} – ${DATE_LONG.format(endDate)}`;
}

export function formatUSD(value: number | null | undefined): string {
  if (value == null) return "—";
  return USD.format(value);
}

export function formatNumber(value: number): string {
  return NUMBER.format(value);
}

export function daysUntil(value: string | null | undefined): number | null {
  if (!value) return null;
  const target = new Date(value).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function relativeDate(value: string | null | undefined): string {
  const d = daysUntil(value);
  if (d == null) return "—";
  if (d < 0) return `${Math.abs(d)} days ago`;
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d < 30) return `In ${d} days`;
  if (d < 365) return `In ${Math.round(d / 30)} months`;
  return `In ${Math.round(d / 365)} years`;
}
