import { useEffect, useReducer } from 'react';
import { MainMenu } from '../components/main-menu/MainMenu';
import { CountdownView } from '../components/speed-tiles/CountdownView';
import { GameBoard } from '../components/speed-tiles/GameBoard';
import { GameHud } from '../components/speed-tiles/GameHud';
import { ResultModal } from '../components/speed-tiles/ResultModal';
import { ERROR_FLASH_MS, TIMER_TICK_MS } from '../game/constants';
import { gameReducer, initialState } from '../game/reducer';
import { formatElapsed } from '../game/utils';
import { supabase } from '../lib/supabase';
import type { ResultState } from '../game/types';

export const App = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (state.phase !== 'countdown') {
      return;
    }

    const id = window.setTimeout(() => {
      dispatch({ type: 'COUNTDOWN_TICK' });
    }, 1000);

    return () => window.clearTimeout(id);
  }, [state]);

  useEffect(() => {
    if (state.phase !== 'playing') {
      return;
    }

    const id = window.setInterval(() => {
      dispatch({ type: 'TIMER_TICK', deltaMs: TIMER_TICK_MS });
    }, TIMER_TICK_MS);

    return () => window.clearInterval(id);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== 'playing' || !state.flashError) {
      return;
    }

    const id = window.setTimeout(() => {
      dispatch({ type: 'CLEAR_ERROR_FLASH' });
    }, ERROR_FLASH_MS);

    return () => window.clearTimeout(id);
  }, [state]);

  useEffect(() => {
    const resultState = state;
    if (resultState.phase !== 'result' || !resultState.won || !resultState.isSubmitting) {
      return;
    }

    const submitScore = async () => {
      if (!supabase) {
        dispatch({ type: 'SUBMIT_ERROR', error: 'Supabase is not configured' });
        return;
      }

      const trimmedName = resultState.playerName.trim();
      if (trimmedName.length === 0) {
        dispatch({ type: 'SUBMIT_ERROR', error: 'Please enter your name' });
        return;
      }

      const { error } = await supabase.from('speed_tiles').insert({
        player_name: trimmedName,
        board_size: resultState.boardSize,
        completion_time_ms: resultState.elapsedMs,
      });

      if (error) {
        dispatch({ type: 'SUBMIT_ERROR', error: error.message });
      } else {
        dispatch({ type: 'SUBMIT_SUCCESS' });
      }
    };

    submitScore();
  }, [state]);

  const handleSubmitScore = () => {
    dispatch({ type: 'SUBMIT_SCORE' });
  };

  const handleResultState = state.phase === 'result' ? (state as ResultState) : null;

  return (
    <main className="app-shell">
      <section className="stage-shell">
        {state.phase === 'menu' ? (
          <MainMenu
            onSelect={(size) => {
              dispatch({ type: 'SELECT_BOARD', size });
            }}
          />
        ) : null}

        {state.phase === 'countdown' ? <CountdownView secondsRemaining={state.secondsRemaining} /> : null}

        {state.phase === 'playing' ? (
          <div className="playing-layout view-transition view-enter">
            <GameHud
              timerText={formatElapsed(state.elapsedMs)}
              failures={state.failures}
              onAbort={() => dispatch({ type: 'RETURN_TO_MENU' })}
            />
            <GameBoard
              boardSize={state.boardSize}
              tiles={state.tiles}
              flashError={state.flashError}
              onPress={(tileId) => dispatch({ type: 'TILE_PRESS', tileId })}
            />
          </div>
        ) : null}

        {state.phase === 'result' && handleResultState ? (
          <ResultModal
            resultState={handleResultState}
            onBackToMenu={() => dispatch({ type: 'RETURN_TO_MENU' })}
            onPlayAgain={() => dispatch({ type: 'PLAY_AGAIN' })}
            onSetPlayerName={(name) => dispatch({ type: 'SET_PLAYER_NAME', playerName: name })}
            onSubmitScore={handleSubmitScore}
            onRetrySubmit={() => dispatch({ type: 'RETRY_SUBMIT' })}
            onDismissSnackbar={() => dispatch({ type: 'DISMISS_SNACKBAR' })}
          />
        ) : null}
      </section>
    </main>
  );
};
