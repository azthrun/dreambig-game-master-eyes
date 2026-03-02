import { useEffect, useState } from 'react';
import { BOARD_SIZES, NUMBER_FLASH_LENGTHS, NUMBER_FLASH_REVEAL_OPTIONS } from '../../game/constants';
import type {
  BoardSize,
  GameMode,
  MenuView,
  NumberFlashLength,
  NumberFlashRevealMs,
} from '../../game/types';
import { Leaderboard } from './Leaderboard';
import gameLogo from '../../assets/game-logo.png';

interface MainMenuProps {
  readonly view: MenuView;
  readonly onOpenGameMenu: (mode: GameMode) => void;
  readonly onBackToRootMenu: () => void;
  readonly onSelectBoardSize: (size: BoardSize) => void;
  readonly onStartNumberFlash: (length: NumberFlashLength, revealMs: NumberFlashRevealMs) => void;
}

export const MainMenu = ({
  view,
  onOpenGameMenu,
  onBackToRootMenu,
  onSelectBoardSize,
  onStartNumberFlash,
}: MainMenuProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedNumberFlashLength, setSelectedNumberFlashLength] = useState<NumberFlashLength | null>(null);

  useEffect(() => {
    if (view !== 'speed-tiles') {
      setShowLeaderboard(false);
    }
    if (view !== 'number-flash') {
      setSelectedNumberFlashLength(null);
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
              <p className="menu-subtitle">
                {selectedNumberFlashLength === null
                  ? 'Step 1: Choose amount of numbers.'
                  : `Step 2: Choose reveal time for ${selectedNumberFlashLength} numbers.`}
              </p>
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
          {selectedNumberFlashLength === null ? (
            <>
              <div className="size-grid">
                {NUMBER_FLASH_LENGTHS.map((length) => (
                  <button
                    key={length}
                    type="button"
                    onClick={() => setSelectedNumberFlashLength(length)}
                    className="size-button"
                  >
                    {length} Numbers
                  </button>
                ))}
              </div>
              <button type="button" onClick={onBackToRootMenu} className="menu-back">
                Back
              </button>
            </>
          ) : (
            <>
              <div className="size-grid">
                {NUMBER_FLASH_REVEAL_OPTIONS.map((revealMs) => (
                  <button
                    key={revealMs}
                    type="button"
                    onClick={() => onStartNumberFlash(selectedNumberFlashLength, revealMs)}
                    className="size-button"
                  >
                    {revealMs}ms
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSelectedNumberFlashLength(null)}
                className="menu-back"
              >
                Back
              </button>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
};
