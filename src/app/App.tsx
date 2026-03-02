import { useEffect, useReducer } from 'react';
import { MainMenu } from '../components/main-menu/MainMenu';
import { NumberFlashBoard } from '../components/number-flash/NumberFlashBoard';
import { NumberFlashResult } from '../components/number-flash/NumberFlashResult';
import { CountdownView } from '../components/speed-tiles/CountdownView';
import { GameBoard } from '../components/speed-tiles/GameBoard';
import { GameHud } from '../components/speed-tiles/GameHud';
import { ResultModal } from '../components/speed-tiles/ResultModal';
import { ERROR_FLASH_MS, TIMER_TICK_MS } from '../game/constants';
import { gameReducer, initialState } from '../game/reducer';
import { formatElapsed } from '../game/utils';
import { supabase } from '../lib/supabase';
import type { NumberFlashInputState, ResultState } from '../game/types';

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
    if (state.phase !== 'number_flash_waiting') {
      return;
    }

    const id = window.setTimeout(() => {
      dispatch({ type: 'NUMBER_FLASH_DELAY_ELAPSED' });
    }, state.delayMs);

    return () => window.clearTimeout(id);
  }, [state]);

  useEffect(() => {
    if (state.phase !== 'number_flash_revealed') {
      return;
    }

    const id = window.setTimeout(() => {
      dispatch({ type: 'NUMBER_FLASH_HIDE_ELAPSED' });
    }, state.revealMs);

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

  const speedTilesResultState = state.phase === 'result' ? (state as ResultState) : null;
  const numberFlashInputState = state.phase === 'number_flash_input' ? (state as NumberFlashInputState) : null;

  return (
    <main className="app-shell">
      <section className="stage-shell">
        {state.phase === 'menu' ? (
          <MainMenu
            view={state.view}
            onOpenGameMenu={(mode) => dispatch({ type: 'OPEN_GAME_MENU', mode })}
            onBackToRootMenu={() => dispatch({ type: 'BACK_TO_ROOT_MENU' })}
            onSelectBoardSize={(size) => {
              dispatch({ type: 'SELECT_BOARD', size });
            }}
            onStartNumberFlash={(length, revealMs) =>
              dispatch({ type: 'START_NUMBER_FLASH', length, revealMs })
            }
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

        {state.phase === 'number_flash_waiting' ? (
          <NumberFlashBoard
            length={state.length}
            visibleSequence={null}
            showInput={false}
            answer=""
            onBackToMenu={() => dispatch({ type: 'RETURN_TO_MENU' })}
          />
        ) : null}

        {state.phase === 'number_flash_revealed' ? (
          <NumberFlashBoard
            length={state.length}
            visibleSequence={state.sequence}
            showInput={false}
            answer=""
            onBackToMenu={() => dispatch({ type: 'RETURN_TO_MENU' })}
          />
        ) : null}

        {state.phase === 'number_flash_input' && numberFlashInputState ? (
          <NumberFlashBoard
            length={numberFlashInputState.length}
            visibleSequence={null}
            showInput
            answer={numberFlashInputState.answer}
            onAnswerChange={(answer) => dispatch({ type: 'SET_NUMBER_FLASH_ANSWER', answer })}
            onSubmit={() => dispatch({ type: 'SUBMIT_NUMBER_FLASH_ANSWER' })}
            onBackToMenu={() => dispatch({ type: 'RETURN_TO_MENU' })}
          />
        ) : null}

        {state.phase === 'number_flash_result' ? (
          <NumberFlashResult
            isCorrect={state.isCorrect}
            answer={state.answer}
            correctSequence={state.sequence}
            onPlayAgain={() => dispatch({ type: 'PLAY_NUMBER_FLASH_AGAIN' })}
            onBackToMenu={() => dispatch({ type: 'RETURN_TO_MENU' })}
          />
        ) : null}

        {state.phase === 'result' && speedTilesResultState ? (
          <ResultModal
            resultState={speedTilesResultState}
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
