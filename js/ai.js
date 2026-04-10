export function collectPlayedCards(state) {
  var cards = [];

  state.completedTricks.forEach(function (trick) {
    trick.cards.forEach(function (play) {
      cards.push(play.card);
    });
  });
  state.trick.forEach(function (play) {
    cards.push(play.card);
  });

  return cards;
}

export function createAiTurnAnalysis(options) {
  var state = options.state;
  var buildDeck = options.buildDeck;
  var rules = options.rules;
  var suits = options.suits;
  var playedCards = collectPlayedCards(state);
  var playedCardIds = {};

  playedCards.forEach(function (card) {
    playedCardIds[card.id] = true;
  });

  return {
    deck: buildDeck(rules, suits),
    playedCards: playedCards,
    playedCardIds: playedCardIds
  };
}

export function countRemainingTrumpOutsidePlayer(player, hand, trump, analysis, effectiveSuit) {
  var known = {};

  Object.keys(analysis.playedCardIds).forEach(function (cardId) {
    known[cardId] = true;
  });
  (hand || []).forEach(function (card) {
    known[card.id] = true;
  });

  return analysis.deck.reduce(function (total, card) {
    if (known[card.id]) {
      return total;
    }
    return total + (effectiveSuit(card, trump) === trump ? 1 : 0);
  }, 0);
}

export function countHigherUnknownCards(card, trump, knownCards, analysis, effectiveSuit, playStrength) {
  var known = {};
  var targetSuit = effectiveSuit(card, trump);
  var leadSuit = targetSuit;

  Object.keys(analysis.playedCardIds).forEach(function (cardId) {
    known[cardId] = true;
  });
  (knownCards || []).forEach(function (knownCard) {
    known[knownCard.id] = true;
  });
  known[card.id] = true;

  return analysis.deck.reduce(function (total, candidate) {
    if (known[candidate.id] || effectiveSuit(candidate, trump) !== targetSuit) {
      return total;
    }
    return total + (playStrength(candidate, leadSuit, trump) > playStrength(card, leadSuit, trump) ? 1 : 0);
  }, 0);
}

export function estimateUnknownWinnerConfidence(card, trump, knownCards, playersAfter, analysis, effectiveSuit, playStrength) {
  var higherUnknown;

  if (playersAfter <= 0) {
    return 1;
  }

  higherUnknown = countHigherUnknownCards(
    card,
    trump,
    knownCards,
    analysis,
    effectiveSuit,
    playStrength
  );

  return Math.max(0, Math.min(1, 1 - (higherUnknown / Math.max(1, playersAfter + 1))));
}

export function selectBestAiPlay(options) {
  var legalCards = options.legalCards;
  var context = options.context;
  var trickLength = options.trickLength;
  var scoreLeadChoice = options.scoreLeadChoice;
  var scoreFollowChoice = options.scoreFollowChoice;
  var shouldReleaseReservedCloser = options.shouldReleaseReservedCloser;
  var scored;
  var preferred;
  var fallback = null;

  if (!legalCards.length) {
    return null;
  }

  scored = legalCards.map(function (card) {
    return {
      card: card,
      score: trickLength === 0
        ? scoreLeadChoice(card, context)
        : scoreFollowChoice(card, context)
    };
  });
  preferred = scored[0];

  scored.slice(1).forEach(function (entry) {
    if (entry.score > preferred.score) {
      preferred = entry;
    }
  });

  if (context.reservedCloser && legalCards.length > 1 && preferred.card.id === context.reservedCloser.id) {
    scored.forEach(function (entry) {
      if (entry.card.id === context.reservedCloser.id) {
        return;
      }
      if (!fallback || entry.score > fallback.score) {
        fallback = entry;
      }
    });
    if (fallback && !shouldReleaseReservedCloser(context, preferred.score, fallback.score)) {
      preferred = fallback;
    }
  }

  return preferred.card;
}
