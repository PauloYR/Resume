import { describe, expect, it } from 'vitest';
import { buildGopherLines } from './gopher-lines';

describe('buildGopherLines', () => {
  it('uses the before and after values when both exist', () => {
    const lines = buildGopherLines([
      { metrics: [{ label: 'Tempo', before: '15 s', after: '1 s' }] },
    ]);
    expect(lines).toEqual(['Tempo: de 15 s para 1 s.']);
  });

  it('uses only the after value otherwise and skips cases without metrics', () => {
    const lines = buildGopherLines([
      { metrics: [{ label: 'Pico', after: '588/s' }] },
      { metrics: [] },
    ]);
    expect(lines).toEqual(['Pico: 588/s.']);
  });
});
