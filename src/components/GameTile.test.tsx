import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TILE_TAP_HINT_MS } from '../game/constants';
import { GameTile } from './GameTile';

describe('GameTile', () => {
  it('shows a temporary tap hint and resets after 500ms', () => {
    vi.useFakeTimers();
    const onPress = vi.fn();

    render(
      <GameTile
        tile={{ id: 'tile-1', value: 1, borderColor: '#EF4444', isCorrectPressed: false }}
        onPress={onPress}
      />
    );

    const tileButton = screen.getByRole('button', { name: 'tile 1' });
    fireEvent.click(tileButton);

    expect(onPress).toHaveBeenCalledWith('tile-1');
    expect(tileButton).toHaveClass('tile-tap-hint');

    act(() => {
      vi.advanceTimersByTime(TILE_TAP_HINT_MS);
    });

    expect(tileButton).not.toHaveClass('tile-tap-hint');
    vi.useRealTimers();
  });
});
