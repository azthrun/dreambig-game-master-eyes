import { useState } from 'react';
import { BOARD_SIZES } from '../../game/constants';
import type { BoardSize } from '../../game/types';
import { Leaderboard } from './Leaderboard';

interface MainMenuProps {
  readonly onSelect: (size: BoardSize) => void;
}

export const MainMenu = ({ onSelect }: MainMenuProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const subtitle = selectedGame
    ? 'Choose a board size to start the round.'
    : 'Choose a game mode to continue.';

  return (
    <section className="menu-card view-transition view-enter">
      <header className="menu-header">
        <h1 className="menu-title">
          {selectedGame === 'speed-tiles' ? 'Speed Tiles' : 'Master Eyes'}
        </h1>
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
      ) : selectedGame === 'speed-tiles' && !showLeaderboard ? (
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
            onClick={() => setShowLeaderboard(true)}
            className="size-button menu-mode-button"
          >
            Leaderboard
          </button>

          <button type="button" onClick={() => setSelectedGame(null)} className="menu-back">
            Back
          </button>
        </div>
      ) : selectedGame === 'speed-tiles' && showLeaderboard ? (
        <Leaderboard onBack={() => setShowLeaderboard(false)} />
      ) : null}
    </section>
  );
};
