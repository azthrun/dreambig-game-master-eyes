import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TAP_FEEDBACK_SOUND_MIN_GAP_MS, TAP_HINT_ANIMATION_MS } from '../../game/constants';
import { GameTile } from './GameTile';

const playTapSoundMock = vi.fn();

vi.mock('../../game/audio', () => ({
  playTapSound: () => playTapSoundMock(),
}));

describe('GameTile', () => {
  it('processes rapid taps immediately while feedback may be adaptively skipped', () => {
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
    fireEvent.click(tileButton);
    fireEvent.click(tileButton);

    expect(onPress).toHaveBeenCalledTimes(3);
    expect(onPress).toHaveBeenNthCalledWith(1, 'tile-1');
    expect(onPress).toHaveBeenNthCalledWith(2, 'tile-1');
    expect(onPress).toHaveBeenNthCalledWith(3, 'tile-1');
    expect(playTapSoundMock).toHaveBeenCalledTimes(1);
    expect(tileButton).toHaveClass('tile-tap-hint');

    vi.advanceTimersByTime(TAP_HINT_ANIMATION_MS);
    expect(tileButton).not.toHaveClass('tile-tap-hint');

    vi.advanceTimersByTime(TAP_FEEDBACK_SOUND_MIN_GAP_MS);
    fireEvent.click(tileButton);
    expect(onPress).toHaveBeenCalledTimes(4);
    expect(playTapSoundMock).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
