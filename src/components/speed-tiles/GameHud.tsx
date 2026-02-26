import { MAX_FAILURES } from '../../game/constants';

interface GameHudProps {
  readonly timerText: string;
  readonly failures: number;
  readonly onAbort: () => void;
}

export const GameHud = ({ timerText, failures, onAbort }: GameHudProps) => {
  const hearts = Array.from({ length: MAX_FAILURES }, (_, index) => index < MAX_FAILURES - failures);

  return (
    <div className="hud-panel">
      <div className="hud-time-block">
        <p className="hud-label">Time</p>
        <p className="hud-time" aria-live="polite">
          {timerText}
        </p>
      </div>
      <div className="hud-hearts" aria-label="remaining lives">
        {hearts.map((filled, index) => (
          <span
            key={`heart-${index + 1}`}
            className={`heart-icon ${filled ? 'heart-filled' : 'heart-empty'}`}
            aria-hidden="true"
          >
            {filled ? '♥' : '♡'}
          </span>
        ))}
      </div>
      <button type="button" className="abort-button" onClick={onAbort}>
        Quit
      </button>
    </div>
  );
};
