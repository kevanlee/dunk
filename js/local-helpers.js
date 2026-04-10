var safeStorageGetModule = function (key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

var safeStorageSetModule = function (key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
};

var safeStorageRemoveModule = function (key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};

var parseStoredJsonModule = function (key) {
  var raw = safeStorageGetModule(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    safeStorageRemoveModule(key);
    return null;
  }
};

var createPersistenceSchedulerModule = function (options) {
  var delay = options && typeof options.delay === "number" ? options.delay : 500;
  var save = options && typeof options.save === "function" ? options.save : function () {
    return false;
  };
  var timerId = null;
  var dirty = false;

  function clearTimer() {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  }

  function flushMatchSave(flushOptions) {
    var shouldForce = Boolean(flushOptions && flushOptions.immediate);
    var shouldSave = dirty || shouldForce;

    clearTimer();
    if (!shouldSave) {
      return false;
    }
    dirty = false;
    return Boolean(save(flushOptions || {}));
  }

  function markMatchDirty() {
    dirty = true;
    clearTimer();
    timerId = window.setTimeout(function () {
      timerId = null;
      flushMatchSave();
    }, delay);
  }

  function discardPendingSave() {
    dirty = false;
    clearTimer();
  }

  return {
    markMatchDirty: markMatchDirty,
    flushMatchSave: flushMatchSave,
    discardPendingSave: discardPendingSave
  };
};

var buildDeckModule = function (rules, suits) {
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
};

var effectiveSuitModule = function (card, trump, rules) {
  if (card.isRook) {
    return trump;
  }
  if (rules.redOneAlwaysTrump && card.suit === "red" && card.rank === 1) {
    return trump;
  }
  return card.suit;
};

var trickRankModule = function (card, trump, rules) {
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
};

var playStrengthModule = function (card, leadSuit, trump, rules) {
  var suit = effectiveSuitModule(card, trump, rules);
  var base = 0;

  if (suit === trump) {
    base = 300;
  } else if (suit === leadSuit) {
    base = 200;
  }

  return base + trickRankModule(card, trump, rules);
};

var determineTrickWinnerModule = function (trick, leadSuit, trump, rules) {
  var winningIndex = 0;
  var winningScore = playStrengthModule(trick[0].card, leadSuit, trump, rules);
  var index;

  for (index = 1; index < trick.length; index += 1) {
    var score = playStrengthModule(trick[index].card, leadSuit, trump, rules);

    if (score > winningScore) {
      winningScore = score;
      winningIndex = index;
    }
  }

  return winningIndex;
};

var cardPointsModule = function (card, rules) {
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
};

var getLegalCardsModule = function (state, player, rules) {
  var hand = state.hands[player] || [];
  var rookCard;
  var ledSuitCards;

  if (state.trick.length === 0) {
    return hand.slice();
  }
  if (rules.rookMode === "official") {
    ledSuitCards = hand.filter(function (card) {
      return effectiveSuitModule(card, state.trump, rules) === state.leadSuit;
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
    return effectiveSuitModule(card, state.trump, rules) === state.leadSuit;
  })) {
    return hand.slice();
  }
  return hand.filter(function (card) {
    return effectiveSuitModule(card, state.trump, rules) === state.leadSuit;
  });
};

var getLegalCardIdSetModule = function (state, player, rules) {
  return new Set(getLegalCardsModule(state, player, rules).map(function (card) {
    return card.id;
  }));
};

var collectPlayedCardsModule = function (state) {
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
};

var createAiTurnAnalysisModule = function (options) {
  var state = options.state;
  var buildDeck = options.buildDeck;
  var rules = options.rules;
  var suits = options.suits;
  var playedCards = collectPlayedCardsModule(state);
  var playedCardIds = {};

  playedCards.forEach(function (card) {
    playedCardIds[card.id] = true;
  });

  return {
    deck: buildDeck(rules, suits),
    playedCards: playedCards,
    playedCardIds: playedCardIds
  };
};

var countRemainingTrumpOutsidePlayerModule = function (player, hand, trump, analysis, effectiveSuit) {
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
};

var countHigherUnknownCardsModule = function (card, trump, knownCards, analysis, effectiveSuit, playStrength) {
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
};

var estimateUnknownWinnerConfidenceModule = function (card, trump, knownCards, playersAfter, analysis, effectiveSuit, playStrength) {
  var higherUnknown;

  if (playersAfter <= 0) {
    return 1;
  }

  higherUnknown = countHigherUnknownCardsModule(
    card,
    trump,
    knownCards,
    analysis,
    effectiveSuit,
    playStrength
  );

  return Math.max(0, Math.min(1, 1 - (higherUnknown / Math.max(1, playersAfter + 1))));
};

var selectBestAiPlayModule = function (options) {
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
};

var setPhaseVisibilityModule = function (ui, phase) {
  ui.phaseWelcome.classList.toggle("hidden", phase !== "welcome");
  ui.phaseSetup.classList.toggle("hidden", phase !== "setup");
  ui.phaseBidding.classList.toggle("hidden", phase !== "bidding");
  ui.phaseTrump.classList.toggle("hidden", phase !== "trump");
  ui.phasePlay.classList.toggle("hidden", phase !== "play");
  ui.phaseScoring.classList.toggle("hidden", phase !== "scoring");
  ui.phaseSummary.classList.toggle("hidden", phase !== "summary");
};

var renderHandGridModule = function (options) {
  var container = options.container;
  var hand = options.hand || [];
  var clickHandler = options.clickHandler;
  var mode = options.mode;
  var state = options.state;
  var legalCardIdSet = options.legalCardIdSet;
  var canDiscardFromBidderSetup = options.canDiscardFromBidderSetup;
  var canDiscardInWoodsonExchange = options.canDiscardInWoodsonExchange;
  var isCardFromKitty = options.isCardFromKitty;
  var triggerCardLockout = options.triggerCardLockout;
  var cardFaceClass = options.cardFaceClass;
  var cardLabel = options.cardLabel;
  var suitClass = options.suitClass;
  var shouldShowRedOneTrumpDot = options.shouldShowRedOneTrumpDot;
  var fragment = document.createDocumentFragment();

  container.innerHTML = "";

  hand.forEach(function (card) {
    var button = document.createElement("button");
    var rank = document.createElement("div");
    var suit = document.createElement("div");
    var legal = mode === "play" && clickHandler ? legalCardIdSet.has(card.id) : true;
    var isWoodsonHand = mode === "woodson-hand";
    var isWoodsonKitty = mode === "woodson-kitty";
    var isCallPartnerCard = mode === "call-partner";
    var isReference;
    var isDiscardSelected;
    var isKittyCard;
    var isWoodsonSelected;
    var isCallPartnerSelected;
    var kittyLegal;
    var woodsonLegal;

    button.type = "button";
    isReference = mode === "reference" || mode === "kitty" || isWoodsonHand || isWoodsonKitty;
    isDiscardSelected = mode === "kitty" && state.selectedDiscards.indexOf(card.id) !== -1;
    isKittyCard = mode === "kitty" && isCardFromKitty(card.id);
    isWoodsonSelected = (isWoodsonHand && state.exchangeSelectedHandCardId === card.id) ||
      (isWoodsonKitty && state.exchangeSelectedKittyCardId === card.id);
    isCallPartnerSelected = isCallPartnerCard && state.pendingCallPartnerCardId === card.id;
    kittyLegal = mode !== "kitty" || canDiscardFromBidderSetup(card);
    woodsonLegal = !isWoodsonHand || canDiscardInWoodsonExchange(card);
    button.className = "card" +
      (card.isRook ? " rook-card" : "") +
      " " + cardFaceClass(card) +
      (isReference ? " reference-card" : "") +
      (mode === "kitty" || isWoodsonHand || isWoodsonKitty || isCallPartnerCard ? " selectable-reference" : "") +
      (mode === "play" && clickHandler && legal ? " playable-card" : "") +
      (isKittyCard ? " kitty-card" : "") +
      (isDiscardSelected || isWoodsonSelected || isCallPartnerSelected ? " selected-discard" : "");
    if (mode === "play" && clickHandler) {
      button.disabled = false;
      button.classList.toggle("inactive-card", !legal);
      button.setAttribute("aria-disabled", legal ? "false" : "true");
      button.addEventListener("click", function () {
        if (legal) {
          clickHandler(card.id);
        } else {
          triggerCardLockout(button);
        }
      });
    } else {
      button.disabled = !clickHandler || !legal || (mode === "kitty" && !kittyLegal) || (isWoodsonHand && !woodsonLegal);
      if (mode === "kitty") {
        button.classList.toggle("inactive-card", !kittyLegal);
      }
      if (isWoodsonHand) {
        button.classList.toggle("inactive-card", !woodsonLegal);
      }
      if (clickHandler && legal && (mode !== "kitty" || kittyLegal) && (!isWoodsonHand || woodsonLegal)) {
        button.addEventListener("click", function () {
          clickHandler(card.id);
        });
      }
    }

    rank.className = "card-rank";
    rank.textContent = cardLabel(card);
    suit.className = "card-suit " + suitClass(card);
    if (mode === "play" && card.isRook && state.trump) {
      button.className += " show-rook-trump rook-trump-" + state.trump;
    }
    if (shouldShowRedOneTrumpDot(card)) {
      button.className += " show-red-one-trump rook-trump-" + state.trump;
    }
    button.appendChild(rank);
    button.appendChild(suit);
    fragment.appendChild(button);
  });

  container.appendChild(fragment);
};
