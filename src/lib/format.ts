const months = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

/** "2023-06" -> "jun/2023". */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  const name = months[index];
  if (!year || !name) throw new Error(`invalid month value: ${value}`);
  return `${name}/${year}`;
}

/** { start: "2023-06", end: "2026-09" } -> "jun/2023 – set/2026"; open end -> "jun/2023 – atual". */
export function formatPeriod(period: {
  start: string;
  end: string | null;
}): string {
  return `${formatMonth(period.start)} – ${period.end ? formatMonth(period.end) : 'atual'}`;
}

/** Whole years between two "YYYY-MM" values, rounded down. */
export function yearsBetween(start: string, end: string): number {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  if (!sy || !sm || !ey || !em) throw new Error('invalid period');
  return Math.floor((ey * 12 + em - (sy * 12 + sm)) / 12);
}
