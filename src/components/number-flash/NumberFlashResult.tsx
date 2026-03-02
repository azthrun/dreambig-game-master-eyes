interface NumberFlashResultProps {
  readonly isCorrect: boolean;
  readonly answer: string;
  readonly correctSequence: string;
  readonly onPlayAgain: () => void;
  readonly onBackToMenu: () => void;
}

export const NumberFlashResult = ({
  isCorrect,
  answer,
  correctSequence,
  onPlayAgain,
  onBackToMenu,
}: NumberFlashResultProps) => (
  <div className="modal-backdrop">
    <div className="modal-card">
      <h2 className="modal-title">{isCorrect ? 'Great Memory!' : 'Not Quite'}</h2>
      <p className="modal-message">
        {isCorrect
          ? 'You entered the exact sequence.'
          : `Your answer: ${answer || '(empty)'}`}
      </p>
      {!isCorrect ? (
        <p className="modal-time-row">
          Correct sequence: <span className="modal-time-value">{correctSequence}</span>
        </p>
      ) : null}
      <div className="result-actions">
        <button type="button" onClick={onPlayAgain} className="play-again-button">
          Play Again
        </button>
        <button type="button" onClick={onBackToMenu} className="modal-action">
          Back to Main Menu
        </button>
      </div>
    </div>
  </div>
);
