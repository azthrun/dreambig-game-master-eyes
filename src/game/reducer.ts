import { COUNTDOWN_SECONDS, MAX_FAILURES, WRONG_CLICK_PENALTY_MS } from './constants';
import type { GameAction, GameState, PlayingState } from './types';
import { generateShuffledTiles } from './utils';

export const initialState: GameState = {
  phase: 'menu',
};

const toResult = (state: PlayingState, won: boolean): GameState => ({
  phase: 'result',
  boardSize: state.boardSize,
  elapsedMs: state.elapsedMs,
  failures: state.failures,
  won,
  playerName: '',
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,
});

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SELECT_BOARD': {
      return {
        phase: 'countdown',
        boardSize: action.size,
        secondsRemaining: COUNTDOWN_SECONDS,
      };
    }
    case 'COUNTDOWN_TICK': {
      if (state.phase !== 'countdown') {
        return state;
      }
      if (state.secondsRemaining <= 1) {
        return {
          phase: 'playing',
          boardSize: state.boardSize,
          tiles: generateShuffledTiles(state.boardSize),
          expectedNumber: 1,
          failures: 0,
          elapsedMs: 0,
          flashError: false,
        };
      }
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
      };
    }
    case 'START_GAME': {
      if (state.phase !== 'countdown') {
        return state;
      }
      return {
        phase: 'playing',
        boardSize: state.boardSize,
        tiles: generateShuffledTiles(state.boardSize),
        expectedNumber: 1,
        failures: 0,
        elapsedMs: 0,
        flashError: false,
      };
    }
    case 'TIMER_TICK': {
      if (state.phase !== 'playing') {
        return state;
      }
      return {
        ...state,
        elapsedMs: state.elapsedMs + action.deltaMs,
      };
    }
    case 'TILE_PRESS': {
      if (state.phase !== 'playing') {
        return state;
      }

      const tile = state.tiles.find((item) => item.id === action.tileId);
      if (!tile) {
        return state;
      }

      if (tile.value !== state.expectedNumber) {
        const failures = state.failures + 1;
        const nextState: PlayingState = {
          ...state,
          failures,
          elapsedMs: state.elapsedMs + WRONG_CLICK_PENALTY_MS,
          flashError: true,
        };
        return failures >= MAX_FAILURES ? toResult(nextState, false) : nextState;
      }

      const nextExpected = state.expectedNumber + 1;
      const nextTiles = state.tiles.map((item) =>
        item.id === action.tileId ? { ...item, isCorrectPressed: true } : item
      );
      const nextState: PlayingState = {
        ...state,
        expectedNumber: nextExpected,
        tiles: nextTiles,
      };

      return nextExpected > state.tiles.length ? toResult(nextState, true) : nextState;
    }
    case 'CLEAR_ERROR_FLASH': {
      if (state.phase !== 'playing' || !state.flashError) {
        return state;
      }
      return {
        ...state,
        flashError: false,
      };
    }
    case 'RETURN_TO_MENU': {
      return initialState;
    }
    case 'SET_PLAYER_NAME': {
      if (state.phase !== 'result' || state.isSubmitting) {
        return state;
      }
      return {
        ...state,
        playerName: action.playerName.slice(0, 50),
        submitError: null,
      };
    }
    case 'SUBMIT_SCORE': {
      if (state.phase !== 'result' || !state.won || state.isSubmitting) {
        return state;
      }
      const trimmedName = state.playerName.trim();
      if (trimmedName.length === 0) {
        return {
          ...state,
          submitError: 'Please enter your name',
        };
      }
      return {
        ...state,
        isSubmitting: true,
        submitError: null,
      };
    }
    case 'SUBMIT_SUCCESS': {
      if (state.phase !== 'result' || !state.isSubmitting) {
        return state;
      }
      return {
        ...state,
        isSubmitting: false,
        submitSuccess: true,
      };
    }
    case 'SUBMIT_ERROR': {
      if (state.phase !== 'result' || !state.isSubmitting) {
        return state;
      }
      return {
        ...state,
        isSubmitting: false,
        submitError: action.error,
      };
    }
    case 'DISMISS_SNACKBAR': {
      if (state.phase !== 'result') {
        return state;
      }
      return {
        ...state,
        submitError: null,
      };
    }
    case 'RETRY_SUBMIT': {
      if (state.phase !== 'result' || !state.submitError) {
        return state;
      }
      return {
        ...state,
        submitError: null,
      };
    }
    default: {
      return state;
    }
  }
};
