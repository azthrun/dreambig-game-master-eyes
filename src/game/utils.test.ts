import { describe, expect, it } from 'vitest';
import { generateShuffledTiles, formatElapsed } from './utils';

describe('generateShuffledTiles', () => {
  it('creates unique values from 1..N', () => {
    const tiles = generateShuffledTiles(3);
    expect(tiles).toHaveLength(9);

    const values = tiles.map((tile) => tile.value).sort((a, b) => a - b);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

describe('formatElapsed', () => {
  it('formats mm:ss.SSS', () => {
    expect(formatElapsed(0)).toBe('00:00.000');
    expect(formatElapsed(61_234)).toBe('01:01.234');
  });
});
