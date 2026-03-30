import { HOUSE_RULES } from '../rulesets/houseRules';
import { dealRound } from './deck';

function cpuBid(base) {
  if (Math.random() < 0.35) return null;
  const jump = 5 * (1 + Math.floor(Math.random() * 6));
  return Math.min(HOUSE_RULES.maxBid, base + jump);
}

export function sanitizeBid(rawBid) {
  const rounded = Math.round(rawBid / HOUSE_RULES.bidIncrement) * HOUSE_RULES.bidIncrement;
  return Math.min(HOUSE_RULES.maxBid, Math.max(HOUSE_RULES.minBid, rounded));
}

export function createNewRound(gameState) {
  const { hands, kitty } = dealRound();
  return {
    ...gameState,
    phase: 'bidding',
    winningBid: HOUSE_RULES.minBid,
    bidWinner: 0,
    trumpSuit: null,
    roundNumber: gameState.roundNumber + 1,
    hands,
    playerHand: hands[0],
    tableCards: [],
    kitty,
    lastBidLog: [`Round ${gameState.roundNumber + 1} started.`],
    lastRoundSummary: null,
  };
}

export function createInitialState() {
  return {
    mode: 'house-rules',
    phase: 'menu',
    teamTotals: [0, 0],
    roundNumber: 0,
    winningBid: HOUSE_RULES.minBid,
    bidWinner: 0,
    trumpSuit: null,
    hands: [[], [], [], []],
    playerHand: [],
    kitty: [],
    tableCards: [],
    lastBidLog: [],
    stats: {
      gamesPlayed: 0,
      roundsPlayed: 0,
      highestBid: HOUSE_RULES.minBid,
      winsByTeam: [0, 0],
    },
    achievements: {
      firstBidWin: false,
      hit200: false,
      underdog: false,
    },
    lastRoundSummary: null,
  };
}

export function runCpuBidding(state, playerBidRaw) {
  const playerBid = sanitizeBid(playerBidRaw);
  let topBid = playerBid;
  let winner = 0;
  const bidLog = [`You opened at ${playerBid}.`];

  for (let seat = 1; seat < 4; seat += 1) {
    const cpuResponse = cpuBid(topBid);
    if (!cpuResponse) {
      bidLog.push(`Seat ${seat + 1} passed.`);
      continue;
    }

    topBid = cpuResponse;
    winner = seat;
    bidLog.push(`Seat ${seat + 1} slammed ${cpuResponse}!`);
  }

  if (winner === 0) {
    bidLog.push('You hold the bid!');
  }

  return {
    ...state,
    winningBid: topBid,
    bidWinner: winner,
    phase: 'trick-preview',
    stats: {
      ...state.stats,
      highestBid: Math.max(state.stats.highestBid, topBid),
    },
    lastBidLog: bidLog,
  };
}
