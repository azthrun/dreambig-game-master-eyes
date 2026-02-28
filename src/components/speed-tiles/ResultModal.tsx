import type { ResultState } from '../../game/types';
import { Snackbar } from '../main-menu/Snackbar';

interface ResultModalProps {
  readonly resultState: ResultState;
  readonly onBackToMenu: () => void;
  readonly onSetPlayerName: (name: string) => void;
  readonly onSubmitScore: () => void;
  readonly onRetrySubmit: () => void;
  readonly onDismissSnackbar: () => void;
}

export const ResultModal = ({
  resultState,
  onBackToMenu,
  onSetPlayerName,
  onSubmitScore,
  onRetrySubmit,
  onDismissSnackbar,
}: ResultModalProps) => {
  const { won, playerName, isSubmitting, submitError, submitSuccess } = resultState;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitScore();
  };

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal-card">
          <h2 className="modal-title">{won ? 'You Win!' : 'Game Over'}</h2>
          <p className="modal-message">
            {won ? 'Great sequence mastery.' : 'You reached the maximum failures.'}
          </p>
          {won ? (
            <p className="modal-time-row">
              Final Time: <span className="modal-time-value">{resultState.elapsedMs !== undefined ? formatTime(resultState.elapsedMs) : ''}</span>
            </p>
          ) : null}
          
          {won && !submitSuccess ? (
            <form onSubmit={handleSubmit} className="submission-form">
              <label htmlFor="player-name" className="player-name-label">
                Enter your name
              </label>
              <input
                id="player-name"
                type="text"
                className="player-name-input"
                placeholder="Your name"
                value={playerName}
                onChange={(e) => onSetPlayerName(e.target.value)}
                maxLength={50}
                disabled={isSubmitting}
                autoComplete="off"
              />
              <div className="submission-actions">
                <button
                  type="button"
                  className="skip-button"
                  onClick={onBackToMenu}
                  disabled={isSubmitting}
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={playerName.trim().length === 0 || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Score'}
                </button>
              </div>
            </form>
          ) : (
            <button type="button" onClick={onBackToMenu} className="modal-action">
              Back to Main Menu
            </button>
          )}

          {submitSuccess && (
            <p className="submission-success-message">Score submitted successfully!</p>
          )}
        </div>
      </div>

      {submitError && (
        <Snackbar
          message={submitError}
          type="error"
          onRetry={onRetrySubmit}
          onDismiss={onDismissSnackbar}
        />
      )}
    </>
  );
};

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);

  const minStr = minutes.toString().padStart(2, '0');
  const secStr = seconds.toString().padStart(2, '0');
  const msStr = milliseconds.toString().padStart(2, '0');

  return `${minStr}:${secStr}.${msStr}`;
}
