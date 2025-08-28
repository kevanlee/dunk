/**
 * AI Strategy and Decision Making
 * Handles AI player card selection, bidding strategy, and gameplay decisions
 */

console.log('ai.js is loading...');

// AI Configuration and Weights (Easy to Tune)
const AI_CONFIG = {
  weights: {
    highCard: 6,        // How much to value high cards (1, 14, 13)
    dunkCard: 12,       // How much to value Dunk cards
    suitLen: 1.5,       // Bonus for having many cards of same suit
    voidBonus: 4,       // Bonus for not having a suit (good for power suit play)
    powerSuitLen: 2.5,  // Bonus for power suit cards
    controlCard: 3,     // Bonus for having highest card of a suit
    partnerLeadBonus: 1.5 // Bonus when partner is leading
  },
  aggression: 1.4,      // Bidding style: 0.5 = conservative, 1.5 = aggressive
};

// Card ranking for Dunk (higher index = better card)
const CARD_RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "1", "D"];
const AI_SUITS = ["yellow", "orange", "green", "blue"];

// Point values for cards
const CARD_POINTS = {
  "D": 20,  // Dunk card
  "1": 15,  // All 1s
  "14": 10, // All 14s
  "10": 10, // All 10s
  "5": 5    // All 5s
};

// Simple helper functions
function cardSortKey(card, powerSuit) {
  const isPowerSuit = card.suit === powerSuit || card.suit === "dunk";
  const rankIdx = CARD_RANKS.indexOf(card.value);
  const powerSuitBias = isPowerSuit ? 100 : 0;
  return powerSuitBias + rankIdx;
}

function countBySuit(hand) {
  const map = {};
  for (const c of hand) map[c.suit] = (map[c.suit] || 0) + 1;
  return map;
}

// Helper function to get card point value
function getCardPoints(card) {
  return CARD_POINTS[card.value] || 0;
}

// Helper function to determine which team a player is on
function getPlayerTeam(playerName) {
  const players = window.gameSetup.PLAYERS;
  if (playerName === players.PLAYER0.name || playerName === players.PLAYER2.name) {
    return 2; // Team 2 (Patricia + Jordan)
  } else if (playerName === players.PLAYER1.name || playerName === players.PLAYER3.name) {
    return 1; // Team 1 (Alex + You)
  }
  return null;
}

// Helper function to determine if two players are on the same team
function areTeammates(player1, player2) {
  return getPlayerTeam(player1) === getPlayerTeam(player2);
}

// Helper function to determine who is likely to win the current trick
function getLikelyTrickWinner(playedCards, powerSuit) {
  if (playedCards.length === 0) return null;
  
  let winner = playedCards[0];
  const leadSuit = playedCards[0].card.suit === 'dunk' ? powerSuit : playedCards[0].card.suit;
  
  for (let i = 1; i < playedCards.length; i++) {
    const current = playedCards[i];
    const currentValue = CARD_RANKS.indexOf(current.card.value);
    const winnerValue = CARD_RANKS.indexOf(winner.card.value);
    
    // Power suit cards beat non-power suit cards
    const currentIsPowerSuit = current.card.suit === powerSuit || current.card.suit === 'dunk';
    const winnerIsPowerSuit = winner.card.suit === powerSuit || winner.card.suit === 'dunk';
    
    if (currentIsPowerSuit && !winnerIsPowerSuit) {
      winner = current;
    } else if (!currentIsPowerSuit && winnerIsPowerSuit) {
      // winner stays the same
    } else if (currentIsPowerSuit && winnerIsPowerSuit) {
      // Both power suit, compare values
      if (currentValue > winnerValue) {
        winner = current;
      }
    } else if (current.card.suit === leadSuit && winner.card.suit === leadSuit) {
      // Both following suit, compare values
      if (currentValue > winnerValue) {
        winner = current;
      }
    } else if (current.card.suit === leadSuit && winner.card.suit !== leadSuit) {
      // Current follows suit, winner doesn't
      winner = current;
    }
    // Otherwise winner stays the same
  }
  
  return winner;
}

// Simple hand strength evaluator
function evaluateHandStrength(hand, powerSuit) {
  let score = 0;
  const bySuit = countBySuit(hand);

  // Score each card
  for (const c of hand) {
    // High cards (top 3 ranks)
    const highRank = CARD_RANKS.indexOf(c.value) >= CARD_RANKS.length - 3;
    if (highRank) score += AI_CONFIG.weights.highCard;

    // Special cards
    if (c.suit === "dunk") score += AI_CONFIG.weights.dunkCard;
    if (c.suit === powerSuit) score += AI_CONFIG.weights.powerSuitLen;
  }

  // Suit distribution bonuses
  for (const suit in bySuit) {
    const len = bySuit[suit];
    score += len * AI_CONFIG.weights.suitLen;
    if (len === 0) score += AI_CONFIG.weights.voidBonus;
  }

  return score;
}

// Simple power suit selection
function chooseBestPowerSuit(hand) {
  let best = { suit: AI_SUITS[0], score: -Infinity };
  for (const s of AI_SUITS) {
    const sc = evaluateHandStrength(hand, s);
    if (sc > best.score) best = { suit: s, score: sc };
  }
  return best.suit;
}

// Strategic bidding logic
function chooseAIBid(hand, currentBid = 0, minBid = 70, maxBid = 200) {
  const powerSuitGuess = chooseBestPowerSuit(hand);
  const strength = evaluateHandStrength(hand, powerSuitGuess);

  console.log(`AI BIDDING DEBUG: Hand strength: ${strength}, Best power suit: ${powerSuitGuess}, Current bid: ${currentBid}`);

  // If opening the bid (no current bid), always bid at least the minimum
  if (currentBid === 0) {
    console.log(`AI BIDDING DEBUG: Opening bid, bidding minimum: ${minBid}`);
    return minBid;
  }

  // Be more aggressive - bid with moderately strong hands
  if (strength < 25) {
    console.log(`AI BIDDING DEBUG: Hand too weak (${strength} < 25), passing`);
    return "pass";
  }

  // Calculate our maximum comfortable bid based on hand strength
  let maxComfortableBid = Math.round(70 + strength * 0.8 * AI_CONFIG.aggression);
  maxComfortableBid = Math.round(maxComfortableBid / 5) * 5; // Round to nearest 5

  // Check what we need to beat
  const minToBeat = currentBid + 5;

  console.log(`AI BIDDING DEBUG: Max comfortable bid: ${maxComfortableBid}, Need to beat: ${minToBeat}`);

  // If we can't beat the current bid comfortably, pass
  if (maxComfortableBid < minToBeat) {
    console.log(`AI BIDDING DEBUG: Max comfortable bid (${maxComfortableBid}) too low, passing`);
    return "pass";
  }

  // Determine bid increment based on hand strength and confidence
  let bidIncrement;
  if (strength >= 50) {
    // Very strong hand - bid aggressively to show confidence
    bidIncrement = 30;
    console.log(`AI BIDDING DEBUG: Strong hand (${strength}), aggressive increment: ${bidIncrement}`);
  } else if (strength >= 45) {
    // Strong hand - moderate increment
    bidIncrement = 25;
    console.log(`AI BIDDING DEBUG: Good hand (${strength}), moderate increment: ${bidIncrement}`);
  } else if (strength >= 35) {
    // Moderate hand - moderate increment
    bidIncrement = 20;
    console.log(`AI BIDDING DEBUG: Moderate hand (${strength}), moderate increment: ${bidIncrement}`);
  } else {
    // Weak hand - still bid but conservatively
    bidIncrement = 15;
    console.log(`AI BIDDING DEBUG: Weak hand (${strength}), conservative increment: ${bidIncrement}`);
  }

  // Ensure increment is at least 5 and is a multiple of 5
  bidIncrement = Math.max(5, Math.round(bidIncrement / 5) * 5);
  
  const finalBid = currentBid + bidIncrement;
  
  console.log(`AI BIDDING DEBUG: Final bid: ${finalBid} (increment: ${bidIncrement})`);
  return Math.min(finalBid, maxBid);
}

// Simple power suit choice
function chooseAIPowerSuit(hand) {
  return chooseBestPowerSuit(hand);
}

// Strategic card selection with point-throwing logic
function selectAICard(aiPlayer, aiHand, playedCards, powerSuit, aiSeat = 0, currentWinnerSeat = null) {
  console.log(`${aiPlayer} selecting card from ${aiHand.length} cards`);
  
  // Get valid cards that can be played
  const validCards = getValidCards(aiHand, playedCards, powerSuit);
  
  if (validCards.length === 0) {
    console.error(`${aiPlayer} has no valid cards to play!`);
    return null;
  }

  // If leading the trick
  if (playedCards.length === 0) {
    // Lead with highest power suit card if available
    const powerSuitCards = validCards.filter(c => c.suit === powerSuit || c.suit === 'dunk');
    if (powerSuitCards.length > 0) {
      const bestPowerSuit = powerSuitCards.sort((a, b) => 
        CARD_RANKS.indexOf(b.value) - CARD_RANKS.indexOf(a.value)
      )[0];
      console.log(`${aiPlayer} leading with power suit: ${bestPowerSuit.suit} ${bestPowerSuit.value}`);
      return bestPowerSuit;
    }
    
    // Otherwise lead with highest card
    const bestCard = validCards.sort((a, b) => 
      CARD_RANKS.indexOf(b.value) - CARD_RANKS.indexOf(a.value)
    )[0];
    console.log(`${aiPlayer} leading with: ${bestCard.suit} ${bestCard.value}`);
    return bestCard;
  }

  // Strategic decision tree for non-leading play
  const leadSuit = playedCards[0].card.suit === 'dunk' ? powerSuit : playedCards[0].card.suit;
  const currentWinner = getCurrentWinner(playedCards, powerSuit);
  
  // Step 1: Can I win this trick?
  if (currentWinner) {
    const winningCards = validCards.filter(card => {
      const cardValue = CARD_RANKS.indexOf(card.value);
      const winnerValue = CARD_RANKS.indexOf(currentWinner.card.value);
      
      // Power suit cards beat non-power suit cards
      const cardIsPowerSuit = card.suit === powerSuit || card.suit === 'dunk';
      const winnerIsPowerSuit = currentWinner.card.suit === powerSuit || currentWinner.card.suit === 'dunk';
      
      if (cardIsPowerSuit && !winnerIsPowerSuit) return true;
      if (!cardIsPowerSuit && winnerIsPowerSuit) return false;
      
      // Both power suit cards - compare values
      if (cardIsPowerSuit && winnerIsPowerSuit) {
        return cardValue > winnerValue;
      }
      
      // Both following suit - compare values
      if (card.suit === leadSuit && currentWinner.card.suit === leadSuit) {
        return cardValue > winnerValue;
      }
      
      // Card follows suit, winner doesn't
      if (card.suit === leadSuit && currentWinner.card.suit !== leadSuit) {
        return true;
      }
      
      return false;
    });
    
    if (winningCards.length > 0) {
      // Play the cheapest winning card
      const cheapestWinner = winningCards.sort((a, b) => 
        CARD_RANKS.indexOf(a.value) - CARD_RANKS.indexOf(b.value)
      )[0];
      console.log(`${aiPlayer} winning with: ${cheapestWinner.suit} ${cheapestWinner.value}`);
      return cheapestWinner;
    }
  }

  // Step 2: Can't win - determine who is likely to win and make strategic decision
  const likelyWinner = getLikelyTrickWinner(playedCards, powerSuit);
  const isTeammateWinning = likelyWinner && areTeammates(aiPlayer, likelyWinner.player);
  
  if (isTeammateWinning) {
    // Teammate is winning - play point card if available, otherwise lowest card
    const pointCards = validCards.filter(card => getCardPoints(card) > 0);
    if (pointCards.length > 0) {
      // Play a point card to help teammate
      const bestPointCard = pointCards.sort((a, b) => getCardPoints(b) - getCardPoints(a))[0];
      console.log(`${aiPlayer} supporting teammate with point card: ${bestPointCard.suit} ${bestPointCard.value} (${getCardPoints(bestPointCard)} points)`);
      return bestPointCard;
    } else {
      // No point cards available, play lowest card
      const lowestCard = validCards.sort((a, b) => 
        CARD_RANKS.indexOf(a.value) - CARD_RANKS.indexOf(b.value)
      )[0];
      console.log(`${aiPlayer} supporting teammate with: ${lowestCard.suit} ${lowestCard.value}`);
      return lowestCard;
    }
  } else {
    // Opponent is winning - avoid playing point cards unless forced
    const pointCards = validCards.filter(card => getCardPoints(card) > 0);
    const nonPointCards = validCards.filter(card => getCardPoints(card) === 0);
    
    // Check if we have non-point cards available
    if (nonPointCards.length > 0) {
      // Play lowest non-point card
      const lowestNonPoint = nonPointCards.sort((a, b) => 
        CARD_RANKS.indexOf(a.value) - CARD_RANKS.indexOf(b.value)
      )[0];
      console.log(`${aiPlayer} avoiding points, playing: ${lowestNonPoint.suit} ${lowestNonPoint.value}`);
      return lowestNonPoint;
    } else {
      // Forced to play a point card - play the lowest value one
      const lowestPointCard = pointCards.sort((a, b) => 
        CARD_RANKS.indexOf(a.value) - CARD_RANKS.indexOf(b.value)
      )[0];
      console.log(`${aiPlayer} forced to play point card: ${lowestPointCard.suit} ${lowestPointCard.value} (${getCardPoints(lowestPointCard)} points)`);
      return lowestPointCard;
    }
  }
}

// Helper function to determine current winner
function getCurrentWinner(playedCards, powerSuit) {
  if (playedCards.length === 0) return null;
  
  let winner = playedCards[0];
  const leadSuit = playedCards[0].card.suit === 'dunk' ? powerSuit : playedCards[0].card.suit;
  
  for (let i = 1; i < playedCards.length; i++) {
    const current = playedCards[i];
    const currentValue = CARD_RANKS.indexOf(current.card.value);
    const winnerValue = CARD_RANKS.indexOf(winner.card.value);
    
    // Power suit cards beat non-power suit cards
    const currentIsPowerSuit = current.card.suit === powerSuit || current.card.suit === 'dunk';
    const winnerIsPowerSuit = winner.card.suit === powerSuit || winner.card.suit === 'dunk';
    
    if (currentIsPowerSuit && !winnerIsPowerSuit) {
      winner = current;
    } else if (!currentIsPowerSuit && winnerIsPowerSuit) {
      // winner stays the same
    } else if (currentIsPowerSuit && winnerIsPowerSuit) {
      // Both power suit, compare values
      if (currentValue > winnerValue) {
        winner = current;
      }
    } else if (current.card.suit === leadSuit && winner.card.suit === leadSuit) {
      // Both following suit, compare values
      if (currentValue > winnerValue) {
        winner = current;
      }
    } else if (current.card.suit === leadSuit && winner.card.suit !== leadSuit) {
      // Current follows suit, winner doesn't
      winner = current;
    }
    // Otherwise winner stays the same
  }
  
  return winner;
}

// Get valid cards that can be played according to game rules
function getValidCards(hand, playedCards, powerSuit) {
  if (playedCards.length === 0) {
    // Leading the trick - can play any card
    return [...hand];
  }
  
  // Not leading - must follow suit if possible
  let ledSuit = playedCards[0].card.suit;
  
  // If Dunk card is led, it declares the power suit
  if (ledSuit === 'dunk') {
    ledSuit = powerSuit;
  }
  
  const cardsOfLedSuit = hand.filter(card => {
    if (card.suit === ledSuit) return true;
    if (card.suit === 'dunk' && powerSuit === ledSuit) return true;
    return false;
  });
  
  if (cardsOfLedSuit.length > 0) {
    // Must follow suit (Dunk card only valid if power suit matches led suit)
    return cardsOfLedSuit;
  } else {
    // Can't follow suit - can play any card
    return [...hand];
  }
}

// Get the index of a card in the original hand
function getCardIndexInHand(originalHand, cardToFind) {
  return originalHand.findIndex(card => 
    card.suit === cardToFind.suit && card.value === cardToFind.value
  );
}

// Kitty management logic
function manageKitty(hand, kitty, powerSuit) {
  // Combine hand and kitty for evaluation
  const allCards = [...hand, ...kitty];
  
  // Sort cards by value (best first)
  const sortedCards = allCards.sort((a, b) => {
    const aValue = CARD_RANKS.indexOf(a.value);
    const bValue = CARD_RANKS.indexOf(b.value);
    
    // Power suit cards are worth more
    const aPowerSuit = (a.suit === powerSuit || a.suit === 'dunk') ? 100 : 0;
    const bPowerSuit = (b.suit === powerSuit || b.suit === 'dunk') ? 100 : 0;
    
    return (bPowerSuit + bValue) - (aPowerSuit + aValue);
  });
  
  // Keep the best 13 cards
  const keepCards = sortedCards.slice(0, 13);
  
  // Return the 5 cards to put back in kitty
  const returnCards = sortedCards.slice(13);
  
  return {
    keep: keepCards,
    return: returnCards
  };
}

// Export functions for use in other modules
window.ai = {
  selectAICard,
  getValidCards,
  getCardIndexInHand,
  evaluateHandStrength,
  chooseBestPowerSuit,
  chooseAIBid,
  chooseAIPowerSuit,
  manageKitty,
  getCurrentWinner,
  getCardPoints,
  getPlayerTeam,
  areTeammates,
  getLikelyTrickWinner,
  AI_CONFIG
};

console.log('ai exported:', Object.keys(window.ai));
