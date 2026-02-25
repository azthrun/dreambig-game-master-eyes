export type BoardSize = 3 | 4 | 5 | 6 | 7 | 8;

export type GamePhase = 'menu' | 'countdown' | 'playing' | 'result';

export interface Tile {
  readonly id: string;
  readonly value: number;
  readonly borderColor: string;
  readonly isCorrectPressed: boolean;
}

export interface MenuState {
  readonly phase: 'menu';
}

export interface CountdownState {
  readonly phase: 'countdown';
  readonly boardSize: BoardSize;
  readonly secondsRemaining: number;
}

export interface PlayingState {
  readonly phase: 'playing';
  readonly boardSize: BoardSize;
  readonly tiles: readonly Tile[];
  readonly expectedNumber: number;
  readonly failures: number;
  readonly elapsedMs: number;
  readonly flashError: boolean;
}

export interface ResultState {
  readonly phase: 'result';
  readonly boardSize: BoardSize;
  readonly elapsedMs: number;
  readonly failures: number;
  readonly won: boolean;
}

export type GameState = MenuState | CountdownState | PlayingState | ResultState;

export type GameAction =
  | { readonly type: 'SELECT_BOARD'; readonly size: BoardSize }
  | { readonly type: 'COUNTDOWN_TICK' }
  | { readonly type: 'START_GAME' }
  | { readonly type: 'TIMER_TICK'; readonly deltaMs: number }
  | { readonly type: 'TILE_PRESS'; readonly tileId: string }
  | { readonly type: 'CLEAR_ERROR_FLASH' }
  | { readonly type: 'RETURN_TO_MENU' };
