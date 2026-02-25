import { MAX_FAILURES } from './constants';

export const heartsFromFailures = (failures: number): { filled: number; empty: number } => {
  const bounded = Math.min(Math.max(failures, 0), MAX_FAILURES);
  return {
    filled: MAX_FAILURES - bounded,
    empty: bounded,
  };
};
