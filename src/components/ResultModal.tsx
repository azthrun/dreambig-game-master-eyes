interface ResultModalProps {
  readonly won: boolean;
  readonly finalTime: string;
  readonly onBackToMenu: () => void;
}

export const ResultModal = ({ won, finalTime, onBackToMenu }: ResultModalProps) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2 className="modal-title">{won ? 'You Win!' : 'Game Over'}</h2>
        <p className="modal-message">
          {won ? 'Great sequence mastery.' : 'You reached the maximum failures.'}
        </p>
        {won ? (
          <p className="modal-time-row">
            Final Time: <span className="modal-time-value">{finalTime}</span>
          </p>
        ) : null}
        <button type="button" onClick={onBackToMenu} className="modal-action">
          Back to Main Menu
        </button>
      </div>
    </div>
  );
};
