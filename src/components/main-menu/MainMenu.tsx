import { useState } from 'react';
import { BOARD_SIZES } from '../../game/constants';
import type { BoardSize } from '../../game/types';

interface MainMenuProps {
  readonly onSelect: (size: BoardSize) => void;
  readonly onShowLeaderboard: () => void;
}

export const MainMenu = ({ onSelect, onShowLeaderboard }: MainMenuProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const subtitle = selectedGame
    ? 'Choose a board size to start the round.'
    : 'Choose a game mode to continue.';

  return (
    <section className="menu-card view-transition view-enter">
      <header className="menu-header">
        <h1 className="menu-title">Master Eyes</h1>
        <p className="menu-subtitle">{subtitle}</p>
      </header>

      {!selectedGame ? (
        <div className="menu-mode">
          <button
            type="button"
            onClick={() => setSelectedGame('speed-tiles')}
            className="size-button menu-mode-button"
          >
            Speed Tiles
          </button>
        </div>
      ) : selectedGame === 'speed-tiles' ? (
        <div className="menu-mode">
          <div className="size-grid">
            {BOARD_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSelect(size)}
                className="size-button"
              >
                {size}x{size}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onShowLeaderboard}
            className="size-button menu-mode-button"
          >
            Leaderboard
          </button>

          <button type="button" onClick={() => setSelectedGame(null)} className="menu-back">
            Back
          </button>
        </div>
      ) : null}
    </section>
  );
};
