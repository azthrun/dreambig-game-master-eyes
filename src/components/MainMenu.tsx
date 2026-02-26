import { useState } from 'react';
import { BOARD_SIZES } from '../game/constants';
import type { BoardSize } from '../game/types';

interface MainMenuProps {
  readonly onSelect: (size: BoardSize) => void;
}

export const MainMenu = ({ onSelect }: MainMenuProps) => {
  const [showBoardSizes, setShowBoardSizes] = useState(false);
  const subtitle = showBoardSizes
    ? 'Choose a board size to start the round.'
    : 'Choose a game mode to continue.';

  return (
    <section className="menu-card view-transition view-enter">
      <header className="menu-header">
        <h1 className="menu-title">Master Eyes</h1>
        <p className="menu-subtitle">{subtitle}</p>
      </header>

      {!showBoardSizes ? (
        <div className="menu-mode">
          <button
            type="button"
            onClick={() => setShowBoardSizes(true)}
            className="size-button menu-mode-button"
          >
            Speed Tiles
          </button>
        </div>
      ) : (
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

          <button type="button" onClick={() => setShowBoardSizes(false)} className="menu-back">
            Back
          </button>
        </div>
      )}
    </section>
  );
};
