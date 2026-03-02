import { useEffect, useRef } from 'react';

interface NumberFlashBoardProps {
  readonly length: number;
  readonly visibleSequence: string | null;
  readonly showInput: boolean;
  readonly answer: string;
  readonly onAnswerChange?: (value: string) => void;
  readonly onSubmit?: () => void;
  readonly onBackToMenu: () => void;
}

export const NumberFlashBoard = ({
  length,
  visibleSequence,
  showInput,
  answer,
  onAnswerChange,
  onSubmit,
  onBackToMenu,
}: NumberFlashBoardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  return (
    <section className="number-flash-layout view-transition view-enter">
      <header className="number-flash-header">
        <h2 className="number-flash-title">Number Flash</h2>
        <p className="number-flash-subtitle">{length} digits mode</p>
      </header>

      <div
        className={`flash-sequence-box ${
          visibleSequence ? 'flash-sequence-box--shown' : 'flash-sequence-box--hidden'
        }`}
        aria-live="polite"
      >
        {visibleSequence ?? '\u00A0'}
      </div>

      {showInput ? (
        <form
          className="number-flash-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.();
          }}
        >
          <label htmlFor="number-flash-answer" className="number-flash-label">
            Enter the sequence
          </label>
          <input
            id="number-flash-answer"
            ref={inputRef}
            className="number-flash-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={answer}
            onChange={(event) => onAnswerChange?.(event.target.value)}
          />
          <button
            type="submit"
            className="number-flash-submit"
            disabled={answer.length === 0}
          >
            Submit
          </button>
        </form>
      ) : (
        <p className="number-flash-waiting">Get ready and watch carefully.</p>
      )}

      <button type="button" className="menu-back" onClick={onBackToMenu}>
        Back to Main Menu
      </button>
    </section>
  );
};
