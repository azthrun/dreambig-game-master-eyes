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
});
