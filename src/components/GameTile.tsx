import type { Tile } from '../game/types';

interface GameTileProps {
  readonly tile: Tile;
  readonly onPress: (tileId: string) => void;
}

export const GameTile = ({ tile, onPress }: GameTileProps) => {
  return (
    <button
      type="button"
      onClick={() => onPress(tile.id)}
      className="tile-button"
      style={{ borderColor: tile.borderColor }}
      aria-label={`tile ${tile.value}`}
    >
      <span className="tile-number">{tile.value}</span>
    </button>
  );
};
