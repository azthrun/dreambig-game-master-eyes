import { describe, expect, it } from 'vitest';
import { gameReducer, initialState } from './reducer';

describe('gameReducer', () => {
  it('moves menu to countdown on board select', () => {
    const next = gameReducer(initialState, { type: 'SELECT_BOARD', size: 3 });
    expect(next.phase).toBe('countdown');
  });

  it('starts playing when countdown reaches zero', () => {
    let state = gameReducer(initialState, { type: 'SELECT_BOARD', size: 3 });
    if (state.phase !== 'countdown') {
      throw new Error('Expected countdown state');
    }
    state = gameReducer(state, { type: 'COUNTDOWN_TICK' });
    state = gameReducer(state, { type: 'COUNTDOWN_TICK' });
    state = gameReducer(state, { type: 'COUNTDOWN_TICK' });
    expect(state.phase).toBe('playing');
  });

  it('adds failure and penalty for wrong click', () => {
    let state = gameReducer(initialState, { type: 'SELECT_BOARD', size: 3 });
    state = gameReducer(state, { type: 'START_GAME' });
    if (state.phase !== 'playing') {
      throw new Error('Expected playing state');
    }

    const wrongTile = state.tiles.find((tile) => tile.value !== 1);
    if (!wrongTile) {
      throw new Error('Expected wrong tile');
    }
    const next = gameReducer(state, { type: 'TILE_PRESS', tileId: wrongTile.id });

    if (next.phase !== 'playing') {
      throw new Error('Expected playing state');
    }
    expect(next.failures).toBe(1);
    expect(next.elapsedMs).toBe(2000);
  });

  it('opens number flash menu from root', () => {
    const next = gameReducer(initialState, { type: 'OPEN_GAME_MENU', mode: 'number-flash' });
    expect(next.phase).toBe('menu');
    if (next.phase !== 'menu') {
      throw new Error('Expected menu state');
    }
    expect(next.view).toBe('number-flash');
  });

  it('plays number flash round and evaluates incorrect answer', () => {
    let state = gameReducer(initialState, { type: 'START_NUMBER_FLASH', length: 4, revealMs: 200 });
    if (state.phase !== 'number_flash_waiting') {
      throw new Error('Expected waiting state');
    }
    expect(state.revealMs).toBe(200);

    state = gameReducer(state, { type: 'NUMBER_FLASH_DELAY_ELAPSED' });
    if (state.phase !== 'number_flash_revealed') {
      throw new Error('Expected revealed state');
    }

    state = gameReducer(state, { type: 'NUMBER_FLASH_HIDE_ELAPSED' });
    if (state.phase !== 'number_flash_input') {
      throw new Error('Expected input state');
    }

    state = gameReducer(state, { type: 'SET_NUMBER_FLASH_ANSWER', answer: '0000' });
    state = gameReducer(state, { type: 'SUBMIT_NUMBER_FLASH_ANSWER' });
    expect(state.phase).toBe('number_flash_result');
    if (state.phase !== 'number_flash_result') {
      throw new Error('Expected result state');
    }
    expect(state.isCorrect).toBe(state.answer === state.sequence);
  });
});
