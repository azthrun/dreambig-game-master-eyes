import { BORDER_COLORS } from './constants';
import type { BoardSize, NumberFlashLength, Tile } from './types';

const shuffle = <T,>(items: readonly T[]): T[] => {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

export const generateShuffledTiles = (size: BoardSize): readonly Tile[] => {
  const total = size * size;
  const numbers = Array.from({ length: total }, (_, idx) => idx + 1);
  const shuffled = shuffle(numbers);

  return shuffled.map((value, index) => ({
    id: `tile-${size}-${value}-${index}`,
    value,
    borderColor: BORDER_COLORS[index % BORDER_COLORS.length],
    isCorrectPressed: false,
  }));
};

export const formatElapsed = (ms: number): string => {
  const safe = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const millis = safe % 1000;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
};

export const randomIntInclusive = (min: number, max: number): number => {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export const hasAdjacentDuplicate = (sequence: string): boolean => {
  for (let idx = 1; idx < sequence.length; idx += 1) {
    if (sequence[idx] === sequence[idx - 1]) {
      return true;
    }
  }
  return false;
};

export const hasConsecutiveTriple = (sequence: string): boolean => {
  for (let idx = 2; idx < sequence.length; idx += 1) {
    const a = Number(sequence[idx - 2]);
    const b = Number(sequence[idx - 1]);
    const c = Number(sequence[idx]);
    if ((b === a + 1 && c === b + 1) || (b === a - 1 && c === b - 1)) {
      return true;
    }
  }
  return false;
};

export const generateNumberFlashSequence = (length: NumberFlashLength): string => {
  const values: string[] = [];

  while (values.length < length) {
    const digit = String(randomIntInclusive(0, 9));
    const prev = values[values.length - 1];
    if (prev === digit) {
      continue;
    }
    values.push(digit);
    if (values.length >= 3 && hasConsecutiveTriple(values.slice(values.length - 3).join(''))) {
      values.pop();
    }
  }

  return values.join('');
};

export const sanitizeNumericInput = (value: string): string => value.replace(/\D+/g, '');
