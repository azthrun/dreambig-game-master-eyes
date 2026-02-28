export type BoardSize = 3 | 4 | 5 | 6 | 7 | 8;

export type GamePhase = 'menu' | 'countdown' | 'playing' | 'result' | 'leaderboard';

export interface Tile {
  readonly id: string;
  readonly value: number;
  readonly borderColor: string;
  readonly isCorrectPressed: boolean;
}

export interface LeaderboardEntry {
  readonly id: string;
  readonly player_name: string;
  readonly board_size: number;
  readonly completion_time_ms: number;
  readonly created_date: string;
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
  readonly playerName: string;
  readonly isSubmitting: boolean;
  readonly submitError: string | null;
  readonly submitSuccess: boolean;
}

export type GameState = MenuState | CountdownState | PlayingState | ResultState;

export type GameAction =
  | { readonly type: 'SELECT_BOARD'; readonly size: BoardSize }
  | { readonly type: 'COUNTDOWN_TICK' }
  | { readonly type: 'START_GAME' }
  | { readonly type: 'TIMER_TICK'; readonly deltaMs: number }
  | { readonly type: 'TILE_PRESS'; readonly tileId: string }
  | { readonly type: 'CLEAR_ERROR_FLASH' }
  | { readonly type: 'RETURN_TO_MENU' }
  | { readonly type: 'SET_PLAYER_NAME'; readonly playerName: string }
  | { readonly type: 'SUBMIT_SCORE' }
  | { readonly type: 'SUBMIT_SUCCESS' }
  | { readonly type: 'SUBMIT_ERROR'; readonly error: string }
  | { readonly type: 'DISMISS_SNACKBAR' }
  | { readonly type: 'RETRY_SUBMIT' }
  | { readonly type: 'PLAY_AGAIN' };
