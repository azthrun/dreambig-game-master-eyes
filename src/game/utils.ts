import { BORDER_COLORS } from './constants';
import type { BoardSize, Tile } from './types';

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
