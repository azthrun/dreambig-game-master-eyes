import { useEffect, useRef } from 'react';
import { playTapSound } from '../../game/audio';
import {
  TAP_FEEDBACK_SOUND_MIN_GAP_MS,
  TAP_HINT_ANIMATION_MS,
  TAP_FEEDBACK_VISUAL_MIN_GAP_MS,
} from '../../game/constants';
import type { Tile } from '../../game/types';

interface GameTileProps {
  readonly tile: Tile;
  readonly onPress: (tileId: string) => void;
}

export const GameTile = ({ tile, onPress }: GameTileProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastVisualFeedbackAtRef = useRef(0);
  const lastSoundFeedbackAtRef = useRef(0);
  const visualCleanupTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (visualCleanupTimeoutRef.current !== null) {
        window.clearTimeout(visualCleanupTimeoutRef.current);
      }
    };
  }, []);

  const handlePress = () => {
    onPress(tile.id);

    const now = Date.now();

    if (now - lastSoundFeedbackAtRef.current >= TAP_FEEDBACK_SOUND_MIN_GAP_MS) {
      lastSoundFeedbackAtRef.current = now;
      playTapSound();
    }

    if (now - lastVisualFeedbackAtRef.current >= TAP_FEEDBACK_VISUAL_MIN_GAP_MS) {
      lastVisualFeedbackAtRef.current = now;
      const buttonEl = buttonRef.current;
      if (buttonEl) {
        buttonEl.classList.remove('tile-tap-hint');
        // Restart short animation without causing React state churn.
        void buttonEl.offsetWidth;
        buttonEl.classList.add('tile-tap-hint');
        if (visualCleanupTimeoutRef.current !== null) {
          window.clearTimeout(visualCleanupTimeoutRef.current);
        }
        visualCleanupTimeoutRef.current = window.setTimeout(() => {
          buttonEl.classList.remove('tile-tap-hint');
          visualCleanupTimeoutRef.current = null;
        }, TAP_HINT_ANIMATION_MS);
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handlePress}
      onAnimationEnd={() => buttonRef.current?.classList.remove('tile-tap-hint')}
      className="tile-button"
      style={{ borderColor: tile.borderColor }}
      aria-label={`tile ${tile.value}`}
    >
      <span className="tile-number">{tile.value}</span>
    </button>
  );
};
