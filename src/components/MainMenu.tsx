import { BOARD_SIZES } from '../game/constants';
import type { BoardSize } from '../game/types';

interface MainMenuProps {
  readonly onSelect: (size: BoardSize) => void;
}

export const MainMenu = ({ onSelect }: MainMenuProps) => {
  return (
    <section className="menu-card view-transition view-enter">
      <header className="menu-header">
        <h1 className="menu-title">Master Eyes</h1>
        <p className="menu-subtitle">Pick a board and tap tiles in ascending order.</p>
      </header>

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
    </section>
  );
};
