/**
 * AI Strategy and Decision Making
 * Handles AI player card selection, bidding strategy, and gameplay decisions
 */

console.log('ai.js is loading...');

/**
 * Select a card for the AI to play
 * @param {string} aiPlayer - Name of the AI player
 * @param {Array} aiHand - The AI's current hand
 * @param {Array} playedCards - Cards already played in current trick
 * @param {string} powerSuit - Current power suit
 * @returns {Object} Selected card data
 */
function selectAICard(aiPlayer, aiHand, playedCards, powerSuit) {
  console.log(`${aiPlayer} selecting card from ${aiHand.length} cards`);
  
  // Get valid cards that can be played
  const validCards = getValidCards(aiHand, playedCards, powerSuit);
  
  if (validCards.length === 0) {
    console.error(`${aiPlayer} has no valid cards to play!`);
    return null;
  }
  
  // Simple AI: pick a random valid card
  const randomIndex = Math.floor(Math.random() * validCards.length);
  const selectedCard = validCards[randomIndex];
  
  console.log(`${aiPlayer} selected: ${selectedCard.suit} ${selectedCard.value}`);
  return selectedCard;
}

/**
 * Get valid cards that can be played according to game rules
 * @param {Array} hand - Player's hand
 * @param {Array} playedCards - Cards already played in current trick
 * @param {string} powerSuit - Current power suit
 * @returns {Array} Array of valid cards to play
 */
function getValidCards(hand, playedCards, powerSuit) {
  if (playedCards.length === 0) {
    // Leading the trick - can play any card
    return [...hand];
  }
  
  // Not leading - must follow suit if possible
  const ledSuit = playedCards[0].card.suit;
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

/**
 * Get the index of a card in the original hand
 * @param {Array} originalHand - The original hand array
 * @param {Object} cardToFind - The card to find
 * @returns {number} Index of the card, or -1 if not found
 */
function getCardIndexInHand(originalHand, cardToFind) {
  return originalHand.findIndex(card => 
    card.suit === cardToFind.suit && card.value === cardToFind.value
  );
}

// Export functions for use in other modules
window.ai = {
  selectAICard,
  getValidCards,
  getCardIndexInHand
};

console.log('ai exported:', Object.keys(window.ai));
