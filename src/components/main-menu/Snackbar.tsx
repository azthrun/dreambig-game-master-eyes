import { useEffect } from 'react';

interface SnackbarProps {
  readonly message: string;
  readonly type: 'error' | 'success';
  readonly onRetry?: () => void;
  readonly onDismiss: () => void;
}

export const Snackbar = ({ message, type, onRetry, onDismiss }: SnackbarProps) => {
  useEffect(() => {
    if (type === 'success') {
      const timer = window.setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => window.clearTimeout(timer);
    }
  }, [type, onDismiss]);

  return (
    <div className={`snackbar snackbar-${type}`}>
      <span className="snackbar-message">{message}</span>
      <div className="snackbar-actions">
        {type === 'error' && onRetry && (
          <button type="button" className="snackbar-retry" onClick={onRetry}>
            Retry
          </button>
        )}
        <button type="button" className="snackbar-dismiss" onClick={onDismiss}>
          {type === 'success' ? 'OK' : 'Dismiss'}
        </button>
      </div>
    </div>
  );
};
