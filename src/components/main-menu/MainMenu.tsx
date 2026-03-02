import { useEffect, useState } from 'react';
import { BOARD_SIZES, NUMBER_FLASH_LENGTHS } from '../../game/constants';
import type { BoardSize, GameMode, MenuView, NumberFlashLength } from '../../game/types';
import { Leaderboard } from './Leaderboard';
import gameLogo from '../../assets/game-logo.png';

interface MainMenuProps {
  readonly view: MenuView;
  readonly onOpenGameMenu: (mode: GameMode) => void;
  readonly onBackToRootMenu: () => void;
  readonly onSelectBoardSize: (size: BoardSize) => void;
  readonly onStartNumberFlash: (length: NumberFlashLength) => void;
}

export const MainMenu = ({
  view,
  onOpenGameMenu,
  onBackToRootMenu,
  onSelectBoardSize,
  onStartNumberFlash,
}: MainMenuProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (view !== 'speed-tiles') {
      setShowLeaderboard(false);
    }
  }, [view]);

  return (
    <section className="menu-card view-transition view-enter">
      {!showLeaderboard && (
        <header className="menu-header">
          {view === 'root' ? (
            <img src={gameLogo} alt="Rush & Reaction" className="menu-logo" />
          ) : null}
          {view === 'speed-tiles' ? (
            <>
              <h1 className="menu-title">Speed Tiles</h1>
              <p className="menu-subtitle">Choose a board size to start the round.</p>
            </>
          ) : null}
          {view === 'number-flash' ? (
            <>
              <h1 className="menu-title">Number Flash</h1>
              <p className="menu-subtitle">Memorize the flash, type the exact sequence.</p>
            </>
          ) : null}
        </header>
      )}

      {view === 'root' ? (
        <div className="menu-mode">
          <button
            type="button"
            onClick={() => onOpenGameMenu('speed-tiles')}
            className="size-button menu-mode-button"
          >
            Speed Tiles
          </button>
          <button
            type="button"
            onClick={() => onOpenGameMenu('number-flash')}
            className="size-button menu-mode-button"
          >
            Number Flash
          </button>
        </div>
      ) : view === 'speed-tiles' && !showLeaderboard ? (
        <div className="menu-mode">
          <div className="size-grid">
            {BOARD_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSelectBoardSize(size)}
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

          <button type="button" onClick={onBackToRootMenu} className="menu-back">
            Back
          </button>
        </div>
      ) : view === 'speed-tiles' && showLeaderboard ? (
        <Leaderboard onBack={() => setShowLeaderboard(false)} />
      ) : view === 'number-flash' ? (
        <div className="menu-mode">
          <div className="size-grid">
            {NUMBER_FLASH_LENGTHS.map((length) => (
              <button
                key={length}
                type="button"
                onClick={() => onStartNumberFlash(length)}
                className="size-button"
              >
                {length} Numbers
              </button>
            ))}
          </div>
          <button type="button" onClick={onBackToRootMenu} className="menu-back">
            Back
          </button>
        </div>
      ) : null}
    </section>
  );
};
