import { useEffect, useMemo, useState } from 'react';
import BottomNav from './components/BottomNav';
import MainMenu from './features/menu/MainMenu';
import TableScreen from './features/table/TableScreen';
import StatsScreen from './features/stats/StatsScreen';
import { createInitialState, createNewRound, runCpuBidding } from './core/game/state';
import { scoreRound } from './core/game/scoring';
import { clearState, loadState, saveState } from './services/storage';

export default function App() {
  const [route, setRoute] = useState('menu');
  const [gameState, setGameState] = useState(() => loadState() ?? createInitialState());

  useEffect(() => {
    saveState(gameState);
  }, [gameState]);

  const winner = useMemo(() => {
    if (gameState.teamTotals[0] >= 500) return 'Team A';
    if (gameState.teamTotals[1] >= 500) return 'Team B';
    return null;
  }, [gameState.teamTotals]);

  function startNewRound() {
    setGameState((prev) => createNewRound(prev));
    setRoute('table');
  }

  function submitBid(playerBid) {
    setGameState((prev) => runCpuBidding(prev, playerBid));
  }

  function resolveRound() {
    setGameState((prev) => {
      const outcome = scoreRound({
        hands: prev.hands,
        kitty: prev.kitty,
        bidWinner: prev.bidWinner,
        winningBid: prev.winningBid,
        currentTotals: prev.teamTotals,
      });

      const newTotals = outcome.newTotals;
      const leadingTeam = newTotals[0] >= newTotals[1] ? 0 : 1;
      const gameCrossedThreshold =
        (prev.teamTotals[0] < 500 && newTotals[0] >= 500) ||
        (prev.teamTotals[1] < 500 && newTotals[1] >= 500);

      return {
        ...prev,
        phase: 'round-end',
        teamTotals: newTotals,
        trumpSuit: outcome.trumpSuit,
        lastRoundSummary: outcome,
        stats: {
          ...prev.stats,
          gamesPlayed: prev.stats.gamesPlayed + (gameCrossedThreshold ? 1 : 0),
          roundsPlayed: prev.stats.roundsPlayed + 1,
          winsByTeam: [
            prev.stats.winsByTeam[0] + (leadingTeam === 0 ? 1 : 0),
            prev.stats.winsByTeam[1] + (leadingTeam === 1 ? 1 : 0),
          ],
        },
        achievements: {
          ...prev.achievements,
          firstBidWin: prev.achievements.firstBidWin || prev.bidWinner === 0,
          hit200: prev.achievements.hit200 || prev.winningBid === 200,
          underdog:
            prev.achievements.underdog ||
            (prev.teamTotals[0] < prev.teamTotals[1] && newTotals[0] > newTotals[1]),
        },
      };
    });
  }

  function resetSave() {
    clearState();
    setGameState(createInitialState());
    setRoute('menu');
  }

  return (
    <main className="app-shell">
      {winner && <div className="winner-banner">{winner} reaches 500! Start next round to keep playing.</div>}

      {route === 'menu' && <MainMenu onStart={startNewRound} onReset={resetSave} />}
      {route === 'table' && (
        <TableScreen
          state={gameState}
          onSubmitBid={submitBid}
          onResolveRound={resolveRound}
          onStartNextRound={startNewRound}
        />
      )}
      {route === 'stats' && (
        <StatsScreen stats={gameState.stats} achievements={gameState.achievements} />
      )}

      <BottomNav current={route} onNavigate={setRoute} />
    </main>
  );
}
