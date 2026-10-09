import { describe, expect, it } from 'vitest';
import { formatMonth, formatPeriod, yearsBetween } from './format';

describe('format', () => {
  it('formats a month in pt-BR short form', () => {
    expect(formatMonth('2023-06')).toBe('jun/2023');
    expect(formatMonth('2026-09')).toBe('set/2026');
  });

  it('formats closed and open periods', () => {
    expect(formatPeriod({ start: '2023-06', end: '2026-09' })).toBe(
      'jun/2023 – set/2026',
    );
    expect(formatPeriod({ start: '2024-01', end: null })).toBe(
      'jan/2024 – atual',
    );
  });

  it('rejects invalid months', () => {
    expect(() => formatMonth('2023-13')).toThrow('invalid month value');
    expect(() => formatMonth('abc')).toThrow('invalid month value');
  });

  it('counts whole years', () => {
    expect(yearsBetween('2023-06', '2026-09')).toBe(3);
    expect(yearsBetween('2018-08', '2021-07')).toBe(2);
  });
});
