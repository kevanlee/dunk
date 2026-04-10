export function buildDeck(rules, suits) {
  var ranks = rules && rules.includedRanks ? rules.includedRanks : [];
  var deck = [];

  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        id: suit + "-" + rank,
        suit: suit,
        rank: rank,
        isRook: false
      });
    });
  });
  deck.push({
    id: "rook",
    suit: null,
    rank: null,
    isRook: true
  });
  return deck;
}

export function effectiveSuit(card, trump, rules) {
  if (card.isRook) {
    return trump;
  }
  if (rules.redOneAlwaysTrump && card.suit === "red" && card.rank === 1) {
    return trump;
  }
  return card.suit;
}

export function trickRank(card, trump, rules) {
  if (rules.redOneAlwaysTrump && !card.isRook && card.suit === "red" && card.rank === 1) {
    return 16;
  }
  if (card.isRook) {
    return rules.rookMode === "house" ? 10.5 : 15;
  }
  if (card.rank === 1) {
    return 15;
  }
  if (rules.rookMode === "house" && card.suit === trump && card.rank === 11) {
    return 11;
  }
  if (rules.rookMode === "house" && card.suit === trump && card.rank === 10) {
    return 10;
  }
  return card.rank;
}

export function playStrength(card, leadSuit, trump, rules) {
  var suit = effectiveSuit(card, trump, rules);
  var base = 0;

  if (suit === trump) {
    base = 300;
  } else if (suit === leadSuit) {
    base = 200;
  }

  return base + trickRank(card, trump, rules);
}

export function determineTrickWinner(trick, leadSuit, trump, rules) {
  var winningIndex = 0;
  var winningScore = playStrength(trick[0].card, leadSuit, trump, rules);
  var index;

  for (index = 1; index < trick.length; index += 1) {
    var score = playStrength(trick[index].card, leadSuit, trump, rules);

    if (score > winningScore) {
      winningScore = score;
      winningIndex = index;
    }
  }

  return winningIndex;
}

export function cardPoints(card, rules) {
  var scoring = rules.scoring;

  if (card.isRook) {
    return scoring.rook;
  }
  if (card.rank === 1) {
    return scoring.rank1;
  }
  if (card.rank === 14) {
    return scoring.rank14;
  }
  if (card.rank === 10) {
    return scoring.rank10;
  }
  if (card.rank === 5) {
    return scoring.rank5;
  }
  return 0;
}

export function getLegalCards(state, player, rules) {
  var hand = state.hands[player] || [];
  var rookCard;
  var ledSuitCards;

  if (state.trick.length === 0) {
    return hand.slice();
  }
  if (rules.rookMode === "official") {
    ledSuitCards = hand.filter(function (card) {
      return effectiveSuit(card, state.trump, rules) === state.leadSuit;
    });
    rookCard = hand.find(function (card) {
      return card.isRook;
    });

    if (!ledSuitCards.length) {
      return hand.slice();
    }
    if (rookCard && state.leadSuit !== state.trump) {
      return ledSuitCards.concat([rookCard]).filter(function (card, index, items) {
        return items.findIndex(function (item) {
          return item.id === card.id;
        }) === index;
      });
    }
    return ledSuitCards;
  }
  if (!hand.some(function (card) {
    return effectiveSuit(card, state.trump, rules) === state.leadSuit;
  })) {
    return hand.slice();
  }
  return hand.filter(function (card) {
    return effectiveSuit(card, state.trump, rules) === state.leadSuit;
  });
}

export function getLegalCardIdSet(state, player, rules) {
  return new Set(getLegalCards(state, player, rules).map(function (card) {
    return card.id;
  }));
}
