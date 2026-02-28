import { useState } from 'react';
import { BOARD_SIZES } from '../../game/constants';
import type { BoardSize } from '../../game/types';
import { Leaderboard } from './Leaderboard';
import gameLogo from '../../assets/game-logo.png';

interface MainMenuProps {
  readonly onSelect: (size: BoardSize) => void;
}

export const MainMenu = ({ onSelect }: MainMenuProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <section className="menu-card view-transition view-enter">
      {!showLeaderboard && (
        <header className="menu-header">
          {!selectedGame ? (
            <img src={gameLogo} alt="Rush & Reaction" className="menu-logo" />
          ) : (
            <>
              <h1 className="menu-title">Speed Tiles</h1>
              <p className="menu-subtitle">Choose a board size to start the round.</p>
            </>
          )}
        </header>
      )}

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
