import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { BoardSize, LeaderboardEntry } from '../../game/types';
import { Snackbar } from './Snackbar';
import { BOARD_SIZES } from '../../game/constants';

interface LeaderboardProps {
  readonly onBack: () => void;
}

export const Leaderboard = ({ onBack }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBoardSize, setSelectedBoardSize] = useState<BoardSize>(3);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError('Supabase is not configured');
      setEntries([]);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('speed_tiles')
      .select('id, player_name, board_size, completion_time_ms, created_date')
      .eq('board_size', selectedBoardSize)
      .order('completion_time_ms', { ascending: true })
      .limit(10);

    if (fetchError) {
      setError(fetchError.message);
      setEntries([]);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedBoardSize]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    const minStr = minutes.toString().padStart(2, '0');
    const secStr = seconds.toString().padStart(2, '0');
    const msStr = milliseconds.toString().padStart(2, '0');

    return `${minStr}:${secStr}.${msStr}`;
  };

  return (
    <div className="leaderboard-view">
      <div className="leaderboard-card">
        <header className="leaderboard-header">
          <h1 className="leaderboard-title">Leaderboard</h1>
          <button type="button" onClick={onBack} className="leaderboard-back">
            Back
          </button>
        </header>

        <div className="leaderboard-tabs">
          {BOARD_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedBoardSize(size)}
              className={`leaderboard-tab ${selectedBoardSize === size ? 'leaderboard-tab-active' : ''}`}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="leaderboard-loading">Loading...</div>
        ) : error ? (
          <div className="leaderboard-error">
            <p>Failed to load leaderboard</p>
            <button type="button" onClick={fetchLeaderboard} className="retry-button">
              Retry
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="leaderboard-empty">
            <p>No scores yet. Be the first!</p>
          </div>
        ) : (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry.id}>
                    <td className="leaderboard-rank">{index + 1}</td>
                    <td className="leaderboard-name">{entry.player_name}</td>
                    <td className="leaderboard-time">{formatTime(entry.completion_time_ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {error && (
        <Snackbar
          message={error}
          type="error"
          onRetry={fetchLeaderboard}
          onDismiss={() => setError(null)}
        />
      )}
    </div>
  );
};
