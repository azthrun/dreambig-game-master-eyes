import { describe, expect, it } from 'vitest';
import {
  formatElapsed,
  generateNumberFlashSequence,
  generateShuffledTiles,
  hasAdjacentDuplicate,
  hasConsecutiveTriple,
  sanitizeNumericInput,
} from './utils';

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

describe('number flash helpers', () => {
  it('generates valid sequence with requested length and digit set', () => {
    const sequence = generateNumberFlashSequence(8);
    expect(sequence).toHaveLength(8);
    expect(/^\d+$/.test(sequence)).toBe(true);
    expect(hasAdjacentDuplicate(sequence)).toBe(false);
    expect(hasConsecutiveTriple(sequence)).toBe(false);
  });

  it('sanitizes non-digit values', () => {
    expect(sanitizeNumericInput('12a-3 4')).toBe('1234');
  });
});
