import { HOUSE_RULES } from '../rulesets/houseRules';

export function cardPoints(card) {
  if (card.id === 'ROOK') return HOUSE_RULES.scoring.rook;
  if (card.rank === 1) return HOUSE_RULES.scoring.one;
  if (card.rank === 14) return HOUSE_RULES.scoring.fourteen;
  if (card.rank === 10) return HOUSE_RULES.scoring.ten;
  if (card.rank === 5) return HOUSE_RULES.scoring.five;
  return 0;
}

export function normalizeRank(card, trumpSuit) {
  if (card.id === 'ROOK') return HOUSE_RULES.rankings.rookTrumpRank;
  if (card.rank === 1) return 15;
  if (card.rank === 14) return 14;
  return card.rank;
}

export function isTrump(card, trumpSuit) {
  return card.id === 'ROOK' || card.suit === trumpSuit;
}

export function compareCards(a, b, ledSuit, trumpSuit) {
  const aTrump = isTrump(a, trumpSuit);
  const bTrump = isTrump(b, trumpSuit);

  if (aTrump && !bTrump) return 1;
  if (!aTrump && bTrump) return -1;

  const aFollows = a.suit === ledSuit || (a.id === 'ROOK' && ledSuit === trumpSuit);
  const bFollows = b.suit === ledSuit || (b.id === 'ROOK' && ledSuit === trumpSuit);

  if (aFollows && !bFollows) return 1;
  if (!aFollows && bFollows) return -1;

  const aRank = normalizeRank(a, trumpSuit);
  const bRank = normalizeRank(b, trumpSuit);

  return aRank === bRank ? 0 : aRank > bRank ? 1 : -1;
}

export function trickWinner(plays, leadSeat, trumpSuit) {
  const ledSuit = plays[leadSeat].id === 'ROOK' ? trumpSuit : plays[leadSeat].suit;
  let winner = leadSeat;

  for (let seat = 0; seat < plays.length; seat += 1) {
    if (seat === winner) continue;
    if (compareCards(plays[seat], plays[winner], ledSuit, trumpSuit) > 0) {
      winner = seat;
    }
  }

  return winner;
}
