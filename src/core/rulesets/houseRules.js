export const HOUSE_RULES = {
  id: 'house-rules',
  label: 'House Rules',
  minBid: 80,
  maxBid: 200,
  bidIncrement: 5,
  pointsToWin: 500,
  kittyInPlay: true,
  rookAlwaysTrump: true,
  forcedTrumpWhenVoid: false,
  scoring: {
    one: 15,
    fourteen: 10,
    ten: 10,
    five: 5,
    rook: 20,
    finalTrick: 20,
    roundTotal: 200,
  },
  rankings: {
    rookTrumpRank: 10.5,
  },
};

export const FUTURE_RULESETS = [
  {
    id: 'classic-kentucky-discard',
    label: 'Classic Kentucky Discard',
    status: 'planned',
  },
  {
    id: 'five-player-secret-partner',
    label: '5-Player Secret Partner',
    status: 'planned',
  },
];
