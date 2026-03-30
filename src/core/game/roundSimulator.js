import { HOUSE_RULES } from '../rulesets/houseRules';
import { cardPoints, isTrump, trickWinner } from './trick';

function cloneHands(hands) {
  return hands.map((hand) => [...hand]);
}

function chooseTrump(hand) {
  const suitCount = new Map([
    ['Red', 0],
    ['Green', 0],
    ['Yellow', 0],
    ['Black', 0],
  ]);

  hand.forEach((card) => {
    if (card.suit !== 'Rook') {
      suitCount.set(card.suit, suitCount.get(card.suit) + (card.rank >= 10 || card.rank === 1 ? 2 : 1));
    }
  });

  return [...suitCount.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function weakestCardIndex(hand, trumpSuit) {
  let weakest = 0;
  for (let i = 1; i < hand.length; i += 1) {
    const current = hand[i];
    const best = hand[weakest];
    const currentWeight = (isTrump(current, trumpSuit) ? 100 : 0) + cardPoints(current) + current.rank;
    const bestWeight = (isTrump(best, trumpSuit) ? 100 : 0) + cardPoints(best) + best.rank;
    if (currentWeight < bestWeight) weakest = i;
  }
  return weakest;
}

function selectCard(hand, ledSuit, trumpSuit) {
  if (!ledSuit) {
    return hand.splice(Math.floor(Math.random() * hand.length), 1)[0];
  }

  const follow = hand.filter((card) => card.suit === ledSuit || (ledSuit === trumpSuit && card.id === 'ROOK'));
  if (follow.length > 0) {
    const chosen = follow.sort((a, b) => b.rank - a.rank)[0];
    hand.splice(hand.findIndex((card) => card.id === chosen.id), 1);
    return chosen;
  }

  // House rule: no forced trump when void in led suit.
  return hand.splice(Math.floor(Math.random() * hand.length), 1)[0];
}

export function simulateRound({ hands, kitty, winningBid, bidWinner }) {
  const liveHands = cloneHands(hands);
  const trumpSuit = chooseTrump(liveHands[bidWinner]);
  const bidWinnerTeam = bidWinner % 2;

  liveHands[bidWinner].push(...kitty);

  const kittyAfterDiscard = [];
  while (liveHands[bidWinner].length > 13) {
    const idx = weakestCardIndex(liveHands[bidWinner], trumpSuit);
    kittyAfterDiscard.push(liveHands[bidWinner].splice(idx, 1)[0]);
  }

  const teamPoints = [0, 0];
  teamPoints[bidWinnerTeam] += kittyAfterDiscard.reduce((sum, card) => sum + cardPoints(card), 0);

  let leadSeat = bidWinner;
  for (let trick = 0; trick < 13; trick += 1) {
    const plays = [];
    let ledSuit = null;

    for (let offset = 0; offset < 4; offset += 1) {
      const seat = (leadSeat + offset) % 4;
      const card = selectCard(liveHands[seat], ledSuit, trumpSuit);
      plays[seat] = card;
      if (offset === 0) {
        ledSuit = card.id === 'ROOK' ? trumpSuit : card.suit;
      }
    }

    const winner = trickWinner(plays, leadSeat, trumpSuit);
    const pilePoints = plays.reduce((sum, card) => sum + cardPoints(card), 0);
    teamPoints[winner % 2] += pilePoints;

    if (trick === 12) {
      teamPoints[winner % 2] += HOUSE_RULES.scoring.finalTrick;
    }

    leadSeat = winner;
  }

  const scored = [...teamPoints];
  if (teamPoints[bidWinnerTeam] < winningBid) {
    scored[bidWinnerTeam] = -winningBid;
  }

  return {
    trumpSuit,
    raw: teamPoints,
    scored,
  };
}
