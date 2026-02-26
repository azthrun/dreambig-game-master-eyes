import { useEffect, useReducer } from 'react';
import { MainMenu } from '../components/main-menu/MainMenu';
import { CountdownView } from '../components/speed-tiles/CountdownView';
import { GameBoard } from '../components/speed-tiles/GameBoard';
import { GameHud } from '../components/speed-tiles/GameHud';
import { ResultModal } from '../components/speed-tiles/ResultModal';
import { ERROR_FLASH_MS, TIMER_TICK_MS } from '../game/constants';
import { gameReducer, initialState } from '../game/reducer';
import { formatElapsed } from '../game/utils';

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

  return (
    <main className="app-shell">
      <section className="stage-shell">
        {state.phase === 'menu' ? <MainMenu onSelect={(size) => dispatch({ type: 'SELECT_BOARD', size })} /> : null}

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

        {state.phase === 'result' ? (
          <ResultModal
            won={state.won}
            finalTime={formatElapsed(state.elapsedMs)}
            onBackToMenu={() => dispatch({ type: 'RETURN_TO_MENU' })}
          />
        ) : null}
      </section>
    </main>
  );
};
