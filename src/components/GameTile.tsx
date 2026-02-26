import { useEffect, useRef, useState } from 'react';
import { TILE_TAP_HINT_MS } from '../game/constants';
import { playTapSound } from '../game/audio';
import type { Tile } from '../game/types';

interface GameTileProps {
  readonly tile: Tile;
  readonly onPress: (tileId: string) => void;
}

export const GameTile = ({ tile, onPress }: GameTileProps) => {
  const [showTapHint, setShowTapHint] = useState(false);
  const hintTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current !== null) {
        window.clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  const handlePress = () => {
    playTapSound();
    onPress(tile.id);
    setShowTapHint(true);

    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
    }

    hintTimeoutRef.current = window.setTimeout(() => {
      setShowTapHint(false);
      hintTimeoutRef.current = null;
    }, TILE_TAP_HINT_MS);
  };

  return (
    <button
      type="button"
      onClick={handlePress}
      className={`tile-button ${showTapHint ? 'tile-tap-hint' : ''}`}
      style={{ borderColor: tile.borderColor }}
      aria-label={`tile ${tile.value}`}
    >
      <span className="tile-number">{tile.value}</span>
    </button>
  );
};
