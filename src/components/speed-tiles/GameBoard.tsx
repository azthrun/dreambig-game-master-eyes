import type { CSSProperties } from 'react';
import type { BoardSize, Tile } from '../../game/types';
import { GameTile } from './GameTile';

interface GameBoardProps {
  readonly boardSize: BoardSize;
  readonly tiles: readonly Tile[];
  readonly onPress: (tileId: string) => void;
  readonly flashError: boolean;
}

const tileFontSize = (boardSize: BoardSize): string => {
  if (boardSize >= 8) return 'clamp(0.75rem, 1.8vmin, 1.1rem)';
  if (boardSize >= 7) return 'clamp(0.85rem, 2.2vmin, 1.25rem)';
  if (boardSize >= 6) return 'clamp(1rem, 2.6vmin, 1.4rem)';
  if (boardSize >= 5) return 'clamp(1.15rem, 3.2vmin, 1.6rem)';
  return 'clamp(1.3rem, 4vmin, 2rem)';
};

export const GameBoard = ({ boardSize, tiles, onPress, flashError }: GameBoardProps) => {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
    ['--tile-font-size' as string]: tileFontSize(boardSize),
  };

  return (
    <section className={`board-shell ${flashError ? 'board-error-flash' : ''}`}>
      <div className="board-grid" style={gridStyle}>
        {tiles.map((tile) => (
          <GameTile key={tile.id} tile={tile} onPress={onPress} />
        ))}
      </div>
    </section>
  );
};
