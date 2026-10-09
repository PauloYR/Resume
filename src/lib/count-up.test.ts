import { describe, expect, it } from 'vitest';
import { easeOutCubic, formatMetric, parseMetric } from './count-up';
import type { ParsedMetric } from './count-up';

describe('parseMetric', () => {
  it('parses integers with a suffix', () => {
    expect(parseMetric('588 acúmulos/s')).toEqual({
      prefix: '',
      value: 588,
      decimals: 0,
      suffix: ' acúmulos/s',
    });
  });

  it('parses pt-BR decimals', () => {
    expect(parseMetric('99,9%')).toEqual({
      prefix: '',
      value: 99.9,
      decimals: 1,
      suffix: '%',
    });
    expect(parseMetric('4,1 mil')?.value).toBe(4.1);
  });

  it('keeps prefixes such as ~ and ≤', () => {
    expect(parseMetric('~2,5 mil')?.prefix).toBe('~');
    expect(parseMetric('≤ 1 s')?.prefix).toBe('≤ ');
  });

  it('skips ranges and non numeric text', () => {
    expect(parseMetric('15–25 s')).toBeNull();
    expect(parseMetric('nunca')).toBeNull();
    expect(parseMetric('possível')).toBeNull();
  });
});

function mustParse(text: string): ParsedMetric {
  const parsed = parseMetric(text);
  if (!parsed) throw new Error(`expected a parsed metric for "${text}"`);
  return parsed;
}

describe('formatMetric', () => {
  it.each(['588 acúmulos/s', '99,9%', '~2,5 mil', '≤ 1 s', '8 devs'])(
    'reproduces "%s" at the end of the animation',
    (text) => {
      expect(formatMetric(mustParse(text), 1)).toBe(text);
    },
  );

  it('starts at zero and keeps the decimal comma', () => {
    const parsed = mustParse('99,9%');
    expect(formatMetric(parsed, 0)).toBe('0,0%');
    expect(formatMetric(parsed, 0.5)).toMatch(/^\d{2},\d%$/);
  });
});

describe('easeOutCubic', () => {
  it('is clamped and monotonic', () => {
    expect(easeOutCubic(-1)).toBe(0);
    expect(easeOutCubic(2)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});
