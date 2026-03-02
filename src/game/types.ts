export type BoardSize = 3 | 4 | 5 | 6 | 7 | 8;
export type NumberFlashLength = 4 | 5 | 6 | 7 | 8;
export type NumberFlashRevealMs = 200 | 300 | 400 | 500;
export type GameMode = 'speed-tiles' | 'number-flash';
export type MenuView = 'root' | 'speed-tiles' | 'number-flash';

export type GamePhase =
  | 'menu'
  | 'countdown'
  | 'playing'
  | 'result'
  | 'number_flash_waiting'
  | 'number_flash_revealed'
  | 'number_flash_input'
  | 'number_flash_result';

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
  readonly view: MenuView;
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

export interface NumberFlashWaitingState {
  readonly phase: 'number_flash_waiting';
  readonly length: NumberFlashLength;
  readonly revealMs: NumberFlashRevealMs;
  readonly sequence: string;
  readonly delayMs: number;
}

export interface NumberFlashRevealedState {
  readonly phase: 'number_flash_revealed';
  readonly length: NumberFlashLength;
  readonly revealMs: NumberFlashRevealMs;
  readonly sequence: string;
}

export interface NumberFlashInputState {
  readonly phase: 'number_flash_input';
  readonly length: NumberFlashLength;
  readonly revealMs: NumberFlashRevealMs;
  readonly sequence: string;
  readonly answer: string;
}

export interface NumberFlashResultState {
  readonly phase: 'number_flash_result';
  readonly length: NumberFlashLength;
  readonly revealMs: NumberFlashRevealMs;
  readonly sequence: string;
  readonly answer: string;
  readonly isCorrect: boolean;
}

export type GameState =
  | MenuState
  | CountdownState
  | PlayingState
  | ResultState
  | NumberFlashWaitingState
  | NumberFlashRevealedState
  | NumberFlashInputState
  | NumberFlashResultState;

export type GameAction =
  | { readonly type: 'OPEN_GAME_MENU'; readonly mode: GameMode }
  | { readonly type: 'BACK_TO_ROOT_MENU' }
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
  | { readonly type: 'PLAY_AGAIN' }
  | {
      readonly type: 'START_NUMBER_FLASH';
      readonly length: NumberFlashLength;
      readonly revealMs: NumberFlashRevealMs;
    }
  | { readonly type: 'NUMBER_FLASH_DELAY_ELAPSED' }
  | { readonly type: 'NUMBER_FLASH_HIDE_ELAPSED' }
  | { readonly type: 'SET_NUMBER_FLASH_ANSWER'; readonly answer: string }
  | { readonly type: 'SUBMIT_NUMBER_FLASH_ANSWER' }
  | { readonly type: 'PLAY_NUMBER_FLASH_AGAIN' };
