import type { BoardSize, NumberFlashLength, NumberFlashRevealMs } from './types';

export const BOARD_SIZES: readonly BoardSize[] = [3, 4, 5, 6, 7, 8];
export const NUMBER_FLASH_LENGTHS: readonly NumberFlashLength[] = [4, 5, 6, 7, 8];
export const NUMBER_FLASH_REVEAL_OPTIONS: readonly NumberFlashRevealMs[] = [200, 300, 400, 500];

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
export const TAP_HINT_ANIMATION_MS = 80;
export const TAP_FEEDBACK_VISUAL_MIN_GAP_MS = 28;
export const TAP_FEEDBACK_SOUND_MIN_GAP_MS = 40;
export const MAX_TAP_SOUND_POLYPHONY = 2;
export const NUMBER_FLASH_MIN_DELAY_MS = 500;
export const NUMBER_FLASH_MAX_DELAY_MS = 4800;
