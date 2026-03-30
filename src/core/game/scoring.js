import { simulateRound } from './roundSimulator';

export function scoreRound({ hands, kitty, bidWinner, winningBid, currentTotals }) {
  const outcome = simulateRound({
    hands,
    kitty,
    winningBid,
    bidWinner,
  });

  return {
    ...outcome,
    newTotals: [
      currentTotals[0] + outcome.scored[0],
      currentTotals[1] + outcome.scored[1],
    ],
  };
}
