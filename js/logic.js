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

/**
 * Bidding Logic
 * Handles bidding rounds, validation, and AI bidding decisions
 */

/**
 * Start a new bidding round
 * @param {number} roundNumber - Current round number (1-based)
 * @returns {Object} Bidding round state
 */
function startBiddingRound(roundNumber) {
  // Determine who bids first based on round number
  // Round 1: PLAYER3 (You), Round 2: PLAYER0 (Patricia), etc.
  const firstBidderIndex = (roundNumber - 1) % 4;
  const playerOrder = [
    window.gameSetup.PLAYERS.PLAYER0.name, // Patricia
    window.gameSetup.PLAYERS.PLAYER1.name, // Alex  
    window.gameSetup.PLAYERS.PLAYER2.name, // Jordan
    window.gameSetup.PLAYERS.PLAYER3.name  // You
  ];
  
  return {
    currentBid: 0,
    currentPlayerIndex: firstBidderIndex,
    playerOrder: playerOrder,
    bids: [],
    passes: [],
    highestBidder: null,
    highestBid: 0,
    isComplete: false,
    winner: null,
    winningBid: 0
  };
}

/**
 * Get the next player to bid (skip those who have passed)
 * @param {Object} biddingState - Current bidding state
 * @returns {string} Next player name, or null if bidding is complete
 */
function getNextBidder(biddingState) {
  if (biddingState.isComplete) {
    return null;
  }
  
  // Find next player who hasn't passed
  let nextIndex = biddingState.currentPlayerIndex;
  let attempts = 0;
  
  while (attempts < 4) {
    nextIndex = (nextIndex + 1) % 4;
    const nextPlayer = biddingState.playerOrder[nextIndex];
    
    if (!biddingState.passes.includes(nextPlayer)) {
      return nextPlayer;
    }
    
    attempts++;
  }
  
  return null; // All players have passed
}

/**
 * Check if a bid is valid
 * @param {number} newBid - The bid amount to validate
 * @param {number} currentHighestBid - Current highest bid
 * @returns {boolean} True if bid is valid
 */
function isValidBid(newBid, currentHighestBid) {
  // Must be at least 5 points higher than current highest bid
  if (newBid <= currentHighestBid) {
    return false;
  }
  
  // Must be divisible by 5
  if (newBid % 5 !== 0) {
    return false;
  }
  
  // Must be within valid range (70-200)
  if (newBid < 70 || newBid > 200) {
    return false;
  }
  
  return true;
}

/**
 * Make a bid for a player
 * @param {Object} biddingState - Current bidding state
 * @param {string} playerName - Name of the player making the bid
 * @param {number} bidAmount - Amount to bid
 * @returns {Object} Updated bidding state
 */
function makeBid(biddingState, playerName, bidAmount) {
  const updatedState = { ...biddingState };
  
  // Validate the bid
  if (!isValidBid(bidAmount, updatedState.highestBid)) {
    throw new Error(`Invalid bid: ${bidAmount}. Must be at least 5 points higher than ${updatedState.highestBid} and divisible by 5.`);
  }
  
  // Record the bid
  updatedState.bids.push({
    player: playerName,
    amount: bidAmount
  });
  
  // Update highest bid
  updatedState.highestBid = bidAmount;
  updatedState.highestBidder = playerName;
  
  // Check if bidding should end (someone bid 200)
  if (bidAmount === 200) {
    updatedState.isComplete = true;
    updatedState.winner = playerName;
    updatedState.winningBid = bidAmount;
  }
  
  // Move to next player
  updatedState.currentPlayerIndex = (updatedState.currentPlayerIndex + 1) % 4;
  
  return updatedState;
}

/**
 * Pass on bidding for a player
 * @param {Object} biddingState - Current bidding state
 * @param {string} playerName - Name of the player passing
 * @returns {Object} Updated bidding state
 */
function passBid(biddingState, playerName) {
  const updatedState = { ...biddingState };
  
  // Record the pass
  updatedState.passes.push(playerName);
  
  // Check if bidding should end (3 players have passed)
  if (updatedState.passes.length >= 3) {
    updatedState.isComplete = true;
    updatedState.winner = updatedState.highestBidder;
    updatedState.winningBid = updatedState.highestBid;
  }
  
  // Move to next player
  updatedState.currentPlayerIndex = (updatedState.currentPlayerIndex + 1) % 4;
  
  return updatedState;
}

/**
 * Simple AI bidding decision
 * @param {string} aiPlayerName - Name of the AI player
 * @param {Array} aiHand - The AI's hand
 * @param {Object} biddingState - Current bidding state
 * @returns {Object} AI decision { action: 'bid'|'pass', amount?: number }
 */
function makeAIBidDecision(aiPlayerName, aiHand, biddingState) {
  console.log(`=== ${aiPlayerName} AI BIDDING DECISION ===`);
  console.log(`Current highest bid: ${biddingState.highestBid}`);
  console.log(`Hand: ${aiHand.map(c => `${c.suit} ${c.value}`).join(', ')}`);
  
  // Use the new AI bidding logic
  const currentHighestBid = biddingState.highestBid;
  const minBid = 70;
  const maxBid = 200;
  
  // Use AI module to make bidding decision
  const aiDecision = window.ai.chooseAIBid(aiHand, currentHighestBid, minBid, maxBid);
  
  console.log(`AI decision: ${aiDecision}`);
  
  if (aiDecision === 'pass') {
    console.log(`${aiPlayerName} decided to PASS`);
    return { action: 'pass' };
  } else {
    console.log(`${aiPlayerName} decided to BID ${aiDecision}`);
    return { action: 'bid', amount: aiDecision };
  }
}

/**
 * Get the current player whose turn it is to bid
 * @param {Object} biddingState - Current bidding state
 * @returns {string} Current player name
 */
function getCurrentBidder(biddingState) {
  return biddingState.playerOrder[biddingState.currentPlayerIndex];
}

/**
 * Check if bidding is complete
 * @param {Object} biddingState - Current bidding state
 * @returns {boolean} True if bidding is complete
 */
function isBiddingComplete(biddingState) {
  return biddingState.isComplete;
}

/**
 * Get bidding result
 * @param {Object} biddingState - Current bidding state
 * @returns {Object} Bidding result { winner, winningBid, bids, passes }
 */
function getBiddingResult(biddingState) {
  if (!biddingState.isComplete) {
    return null;
  }
  
  return {
    winner: biddingState.winner,
    winningBid: biddingState.winningBid,
    bids: biddingState.bids,
    passes: biddingState.passes
  };
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Choose power suit based on most cards, alphabetical tiebreaker
 * @param {Array} hand - Array of card objects
 * @returns {string} Chosen power suit
 */
function choosePowerSuit(hand) {
  // Use the new AI power suit selection logic
  return window.ai.chooseAIPowerSuit(hand);
}

/**
 * Handle computer kitty management
 * @param {string} computerPlayer - Name of the computer player
 * @param {Array} computerHand - Computer's current hand
 * @param {Array} kitty - Current kitty cards
 * @returns {Object} Result with new hand, new kitty, and power suit
 */
function handleComputerKitty(computerPlayer, computerHand, kitty) {
  console.log(`${computerPlayer} managing kitty...`);
  
  // 1. Add kitty cards to hand (13 + 5 = 18 cards)
  const combinedHand = [...computerHand, ...kitty];
  console.log(`${computerPlayer} combined hand (18 cards):`, combinedHand.map(card => `${card.suit} ${card.value}`).join(', '));
  
  // 2. Use AI to choose power suit first
  const powerSuit = window.ai.chooseAIPowerSuit(combinedHand);
  console.log(`${computerPlayer} AI chose power suit: ${powerSuit}`);
  
  // 3. Use AI to manage kitty (choose which cards to keep)
  const kittyResult = window.ai.manageKitty(computerHand, kitty, powerSuit);
  const newHand = kittyResult.keep;
  const newKitty = kittyResult.return;
  
  console.log(`${computerPlayer} AI new hand (13 cards):`, newHand.map(card => `${card.suit} ${card.value}`).join(', '));
  console.log(`${computerPlayer} AI new kitty (5 cards):`, newKitty.map(card => `${card.suit} ${card.value}`).join(', '));
  
  return { newHand, newKitty, powerSuit };
}

/**
 * Handle human kitty management
 * @param {Array} playerHand - Player's current hand (13 cards)
 * @param {Array} kitty - Current kitty cards (5 cards)
 * @param {Array} selectedCards - Cards selected by player to return to kitty
 * @param {string} chosenPowerSuit - Power suit chosen by player
 * @returns {Object} Result with new hand, new kitty, and power suit
 */
function handleHumanKitty(playerHand, kitty, selectedCards, chosenPowerSuit) {
  // Validate that exactly 5 cards were selected
  if (selectedCards.length !== 5) {
    throw new Error(`Must select exactly 5 cards. Selected: ${selectedCards.length}`);
  }
  
  // 1. Combine player hand and kitty (13 + 5 = 18 cards)
  const combinedCards = [...playerHand, ...kitty];
  
  // 2. Create new hand by removing selected cards from combined set
  const newHand = combinedCards.filter(card => 
    !selectedCards.some(selected => 
      selected.suit === card.suit && selected.value === card.value
    )
  );
  
  // 3. Create new kitty from selected cards
  const newKitty = [...selectedCards];
  
  console.log('Kitty management complete:', newHand.length, 'cards in hand,', newKitty.length, 'cards in kitty');
  
  return { newHand, newKitty, powerSuit: chosenPowerSuit };
}

/**
 * Get all available cards for human kitty selection (player hand + kitty)
 * @param {Array} playerHand - Player's current hand
 * @param {Array} kitty - Current kitty cards
 * @returns {Array} Combined array of all available cards
 */
function getAvailableCardsForSelection(playerHand, kitty) {
  return [...playerHand, ...kitty];
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
  createNewGame,
  // Bidding functions
  startBiddingRound,
  getNextBidder,
  isValidBid,
  makeBid,
  passBid,
  makeAIBidDecision,
  getCurrentBidder,
  isBiddingComplete,
  getBiddingResult,
  // Computer kitty functions
  handleComputerKitty,
  handleHumanKitty,
  getAvailableCardsForSelection,
  choosePowerSuit,
  shuffleArray
};

console.log('cardLogic exported:', Object.keys(window.cardLogic));
