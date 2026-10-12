import { describe, expect, it } from 'vitest';
import { withLiveUrl } from './demos';

describe('withLiveUrl', () => {
  it('sorts by order and attaches the url by id', () => {
    const result = withLiveUrl(
      [
        { id: 'b', order: 2 },
        { id: 'a', order: 1 },
      ],
      { a: 'https://a.example' },
    );
    expect(result.map((item) => item.id)).toEqual(['a', 'b']);
    expect(result[0]?.url).toBe('https://a.example');
    expect(result[1]?.url).toBeUndefined();
  });
});
