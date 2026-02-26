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
  if (boardSize >= 8) return 'clamp(0.6rem, 1.45vmin, 0.9rem)';
  if (boardSize >= 7) return 'clamp(0.68rem, 1.8vmin, 1rem)';
  if (boardSize >= 6) return 'clamp(0.78rem, 2.2vmin, 1.1rem)';
  if (boardSize >= 5) return 'clamp(0.92rem, 2.8vmin, 1.25rem)';
  return 'clamp(1rem, 3.4vmin, 1.5rem)';
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
