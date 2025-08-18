/**
 * Kentucky Rook Card and Deck Logic
 * Handles card creation, deck building, shuffling, and dealing
 */

console.log('logic.js is loading...');

// Card suits/colors in Kentucky Rook
const SUITS = {
  ORANGE: 'orange',
  YELLOW: 'yellow', 
  BLUE: 'blue',
  GREEN: 'green',
  DUNK: 'dunk' // Special card
};

// Card values and their point values
const CARD_VALUES = {
  1: 15,   // 1s are worth 15 points
  5: 5,    // 5s are worth 5 points
  10: 10,  // 10s are worth 10 points
  14: 10,  // 14s are worth 10 points
  'D': 20  // Dunk card is worth 20 points
};

// Standard card values (excluding special cards)
const STANDARD_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

/**
 * Create a single card object
 * @param {string} suit - The card suit/color
 * @param {number|string} value - The card value
 * @returns {Object} Card object
 */
function createCard(suit, value) {
  return {
    suit: suit,
    value: value,
    points: CARD_VALUES[value] || 0,
    id: `${suit}-${value}`,
    isDunk: value === 'D',
    isPowerSuit: false // Will be set when power suit is determined
  };
}

/**
 * Create a complete Kentucky Rook deck
 * @returns {Array} Array of card objects
 */
function createDeck() {
  const deck = [];
  
  // Add standard cards for each suit (orange, yellow, blue, green)
  Object.values(SUITS).forEach(suit => {
    if (suit !== SUITS.DUNK) {
      STANDARD_VALUES.forEach(value => {
        deck.push(createCard(suit, value));
      });
    }
  });
  
  // Add the Dunk card
  deck.push(createCard(SUITS.DUNK, 'D'));
  
  return deck;
}

/**
 * Shuffle a deck of cards using Fisher-Yates algorithm
 * @param {Array} deck - Array of card objects
 * @returns {Array} Shuffled deck
 */
function shuffleDeck(deck) {
  const shuffled = [...deck]; // Create a copy to avoid mutating original
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Deal cards to players and create kitty
 * @param {Array} deck - Shuffled deck
 * @param {number} numPlayers - Number of players (default 4 for Kentucky Rook)
 * @param {number} cardsPerPlayer - Cards per player (default 13)
 * @returns {Object} Object containing player hands, kitty, and remaining deck
 */
function dealCards(deck, numPlayers = 4, cardsPerPlayer = 13) {
  const hands = [];
  const remainingDeck = [...deck];
  
  // Initialize empty hands
  for (let i = 0; i < numPlayers; i++) {
    hands.push([]);
  }
  
  // Deal cards round-robin style
  for (let round = 0; round < cardsPerPlayer; round++) {
    for (let player = 0; player < numPlayers; player++) {
      if (remainingDeck.length > 0) {
        const card = remainingDeck.pop();
        hands[player].push(card);
      }
    }
  }
  
  // Create kitty from remaining 5 cards
  const kitty = [];
  for (let i = 0; i < 5; i++) {
    if (remainingDeck.length > 0) {
      const card = remainingDeck.pop();
      kitty.push(card);
    }
  }
  
  return {
    hands: hands,
    kitty: kitty,
    remainingDeck: remainingDeck
  };
}

/**
 * Sort a hand of cards by suit and value
 * @param {Array} hand - Array of card objects
 * @param {string} powerSuit - The current power suit (optional)
 * @returns {Array} Sorted hand
 */
function sortHand(hand, powerSuit = null) {
  const sorted = [...hand];
  
  // Sort by suit first, then by value
  sorted.sort((a, b) => {
    // Power suit comes first
    if (powerSuit) {
      if (a.suit === powerSuit && b.suit !== powerSuit) return -1;
      if (a.suit !== powerSuit && b.suit === powerSuit) return 1;
    }
    
    // Then by suit order (orange, yellow, blue, green, dunk)
    const suitOrder = [SUITS.ORANGE, SUITS.YELLOW, SUITS.BLUE, SUITS.GREEN, SUITS.DUNK];
    const aSuitIndex = suitOrder.indexOf(a.suit);
    const bSuitIndex = suitOrder.indexOf(b.suit);
    
    if (aSuitIndex !== bSuitIndex) {
      return aSuitIndex - bSuitIndex;
    }
    
    // Then by value (1 is highest, then 14, 13, 12, etc.)
    if (a.value === 1) return -1;
    if (b.value === 1) return 1;
    if (a.value === 'D') return -1;
    if (b.value === 'D') return 1;
    
    return b.value - a.value; // Higher numbers first
  });
  
  return sorted;
}

/**
 * Get the total points in a hand
 * @param {Array} hand - Array of card objects
 * @returns {number} Total points
 */
function getHandPoints(hand) {
  return hand.reduce((total, card) => total + card.points, 0);
}

/**
 * Check if a hand contains a specific suit
 * @param {Array} hand - Array of card objects
 * @param {string} suit - Suit to check for
 * @returns {boolean} True if hand contains the suit
 */
function hasSuit(hand, suit) {
  return hand.some(card => card.suit === suit);
}

/**
 * Get all cards of a specific suit from a hand
 * @param {Array} hand - Array of card objects
 * @param {string} suit - Suit to filter by
 * @returns {Array} Cards of the specified suit
 */
function getCardsOfSuit(hand, suit) {
  return hand.filter(card => card.suit === suit);
}

/**
 * Create a new game with shuffled deck and dealt hands
 * @param {number} numPlayers - Number of players (default 4)
 * @returns {Object} Game state with deck, hands, and kitty
 */
function createNewGame(numPlayers = 4) {
  const deck = createDeck();
  const shuffledDeck = shuffleDeck(deck);
  const { hands, kitty, remainingDeck } = dealCards(shuffledDeck, numPlayers);
  
  return {
    deck: shuffledDeck,
    hands: hands,
    kitty: kitty,
    remainingDeck: remainingDeck,
    numPlayers: numPlayers,
    powerSuit: null, // Will be set during bidding
    currentBid: 0,
    winningBidder: null
  };
}

// Export functions for use in other modules
window.cardLogic = {
  SUITS,
  CARD_VALUES,
  createCard,
  createDeck,
  shuffleDeck,
  dealCards,
  sortHand,
  getHandPoints,
  hasSuit,
  getCardsOfSuit,
  createNewGame
};

console.log('cardLogic exported:', Object.keys(window.cardLogic));
