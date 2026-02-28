import type { BoardSize } from './types';

export const BOARD_SIZES: readonly BoardSize[] = [3, 4, 5, 6, 7, 8];

export const BORDER_COLORS = [
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#14B8A6',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#6B7280',
  '#000000',
] as const;

export const MAX_FAILURES = 3;
export const COUNTDOWN_SECONDS = 3;
export const WRONG_CLICK_PENALTY_MS = 2000;
export const TIMER_TICK_MS = 50;
export const ERROR_FLASH_MS = 350;
export const TILE_TAP_HINT_MS = 50;
