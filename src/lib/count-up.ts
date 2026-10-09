// Count-up for metric values written in pt-BR ("99,9%", "~2,5 mil", "≤ 1 s").
// Only values with exactly one number are animated; ranges ("15–25 s") and words
// ("nunca") are left alone, so the final text in the HTML is always the source of truth.

export interface ParsedMetric {
  prefix: string;
  value: number;
  decimals: number;
  suffix: string;
}

const NUMBER = /\d+(?:,\d+)?/g;

export function parseMetric(text: string): ParsedMetric | null {
  const matches = [...text.matchAll(NUMBER)];
  const [match] = matches;
  if (matches.length !== 1 || !match) return null;

  const raw = match[0];
  const start = match.index ?? 0;
  const [, fraction = ''] = raw.split(',');

  return {
    prefix: text.slice(0, start),
    value: Number(raw.replace(',', '.')),
    decimals: fraction.length,
    suffix: text.slice(start + raw.length),
  };
}

export function easeOutCubic(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return 1 - (1 - clamped) ** 3;
}

// `progress` is 0..1 of the animation; 1 reproduces the original text exactly.
export function formatMetric(parsed: ParsedMetric, progress: number): string {
  const current = parsed.value * easeOutCubic(progress);
  const number = current.toFixed(parsed.decimals).replace('.', ',');
  return `${parsed.prefix}${number}${parsed.suffix}`;
}
