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
    default: {
      return state;
    }
  }
};
