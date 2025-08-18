
/**
 * Game State Management
 * Handles the current phase of the game and state transitions
 */

// Game phases in order of progression
const GAME_PHASES = {
  WELCOME: 'welcome',
  NEW_GAME: 'new_game',
  NEW_ROUND: 'new_round',
  DEALING: 'dealing', 
  BIDDING: 'bidding',
  GAMEPLAY: 'gameplay',
  ROUND_SCORING: 'round_scoring',
  END: 'end'
};



// Current game state
let gameState = {
  currentPhase: GAME_PHASES.WELCOME,
  // Game data
  deck: null,
  hands: null,
  kitty: null,
  remainingDeck: null,
  numPlayers: 4,
  // Round state (static for now)
  roundState: {
    currentBid: 150,
    bidWinner: "You",
    powerSuit: "orange",
    currentTrick: 0,
    trickLeader: "You", // starts as bid winner
    currentTurn: "You", // current player's turn
    turnOrder: ["Patricia", "Alex", "Jordan", "You"], // clockwise order
    playedCards: [], // cards played in current trick
    trickWinners: [], // who won each trick
    trickHistory: [] // history of all tricks in this round
  },
  // Player data
  playerHand: null, // Current player's hand (hand[0])
  // Game progression
  currentHand: 0,
  // Scores
  scores: {
    team1: 0,
    team2: 0
  }
};

/**
 * Get current game state
 * @returns {Object} Current game state
 */
function getGameState() {
  return { ...gameState };
}

/**
 * Get current phase
 * @returns {string} Current game phase
 */
function getCurrentPhase() {
  return gameState.currentPhase;
}

/**
 * Set the current game phase
 * @param {string} phase - The phase to set
 */
function setCurrentPhase(phase) {
  if (!Object.values(GAME_PHASES).includes(phase)) {
    console.error('Invalid phase:', phase);
    return;
  }
  
  const previousPhase = gameState.currentPhase;
  gameState.currentPhase = phase;
  console.log(`Game phase changed: ${previousPhase} → ${phase}`);
}

/**
 * Navigate to the next phase in the game flow
 */
function nextPhase() {
  const phases = Object.values(GAME_PHASES);
  const currentIndex = phases.indexOf(gameState.currentPhase);
  const nextIndex = (currentIndex + 1) % phases.length;
  const nextPhase = phases[nextIndex];
  
  setCurrentPhase(nextPhase);
}

/**
 * Navigate to a specific phase
 * @param {string} phase - The phase to navigate to
 */
function navigateToPhase(phase) {
  setCurrentPhase(phase);
}

/**
 * Reset the game to initial state
 */
function resetGame() {
  console.log('Resetting game...');
  gameState = {
    currentPhase: GAME_PHASES.WELCOME,
    // Game data
    deck: null,
    hands: null,
    kitty: null,
    remainingDeck: null,
    numPlayers: 4,
    // Round state
    roundState: {
      currentBid: 150,
      bidWinner: "You",
      powerSuit: "orange",
      currentTrick: 0,
      trickLeader: "You",
      currentTurn: "You",
      turnOrder: ["Patricia", "Alex", "Jordan", "You"],
      playedCards: [],
      trickWinners: [],
      trickHistory: []
    },
    // Player data
    playerHand: null,
    // Game progression
    currentHand: 0,
    // Scores
    scores: {
      team1: 0,
      team2: 0
    }
  };
  console.log('Game reset complete');
}

/**
 * Initialize the game state
 */
function initializeGameState() {
  console.log('Initializing game state...');
  gameState = {
    currentPhase: GAME_PHASES.WELCOME,
    // Game data
    deck: null,
    hands: null,
    kitty: null,
    remainingDeck: null,
    numPlayers: 4,
    // Round state
    roundState: {
      currentBid: 150,
      bidWinner: "You",
      powerSuit: "orange",
      currentTrick: 0,
      trickLeader: "You",
      currentTurn: "You",
      turnOrder: ["Patricia", "Alex", "Jordan", "You"],
      playedCards: [],
      trickWinners: [],
      trickHistory: []
    },
    // Player data
    playerHand: null,
    // Game progression
    currentHand: 0,
    // Scores
    scores: {
      team1: 0,
      team2: 0
    }
  };
  console.log('Game state initialized. Current phase:', gameState.currentPhase);
  
  // Initialize UI to show welcome screen
  updateUIForCurrentPhase();
}

/**
 * Update UI elements based on current game phase
 */
function updateUIForCurrentPhase() {
  const currentPhase = gameState.currentPhase;
  console.log('Updating UI for phase:', currentPhase);
  
  // Hide all modal sections first, but preserve the basketballs section
  const allModalSections = document.querySelectorAll('.modal-row');
  allModalSections.forEach(section => {
    // Never hide the basketballs section at the bottom
    if (!section.querySelector('.bballs')) {
      section.classList.add('hidden');
    }
  });
  
  // Show appropriate section based on phase
  switch (currentPhase) {
    case GAME_PHASES.WELCOME:
      const welcomeSection = document.querySelector('.get-started').closest('.modal-row');
      welcomeSection.classList.remove('hidden');
      break;
    case GAME_PHASES.NEW_GAME:
      // NEW_GAME is handled in background, no UI change needed
      break;
    case GAME_PHASES.NEW_ROUND:
      // NEW_ROUND is handled in background, no UI change needed
      break;
    case GAME_PHASES.DEALING:
      // Show jumbotron section (but keep jumbotron invisible)
      const jumbotronSection = document.querySelector('.jumbotron.top').closest('.modal-row');
      jumbotronSection.classList.remove('hidden');
      
      // Show only the first dealing section initially
      const dealingSections = document.querySelectorAll('.your-hand');
      if (dealingSections.length > 0) {
        dealingSections[0].classList.remove('hidden'); // First section with "DEALING..." text
        
        // Start the card dealing animation if we have a player hand
        if (gameState.playerHand && gameState.playerHand.length > 0) {
          // Small delay to ensure UI is ready
          setTimeout(() => {
            dealCardsAnimation(gameState.playerHand);
          }, 100);
        }
      }
      break;
    case GAME_PHASES.BIDDING:
      // Show jumbotron section (but keep jumbotron invisible)
      const jumbotronSectionBidding = document.querySelector('.jumbotron.top').closest('.modal-row');
      jumbotronSectionBidding.classList.remove('hidden');
      
      // Show bidding section
      const biddingSection = document.querySelector('.cols-bidding').closest('.row');
      if (biddingSection) {
        biddingSection.classList.remove('hidden');
        
        // Add event listener to Next button in bidding section
        const nextButton = biddingSection.querySelector('.right button');
        if (nextButton) {
          console.log('Found bidding Next button, adding event listener');
          nextButton.addEventListener('click', handleBiddingNextClick, { once: true });
        } else {
          console.error('Could not find Next button in bidding section');
        }
      }
      
      // Show the .your-hand section (the one that was visible during dealing)
      const yourHandSections = document.querySelectorAll('.your-hand');
      if (yourHandSections.length > 0) {
        yourHandSections[0].classList.remove('hidden'); // Show the first .your-hand section
      }
      break;
    case GAME_PHASES.GAMEPLAY:
      // Show jumbotron section and remove invisible class
      const jumbotronSectionGameplay = document.querySelector('.jumbotron.top').closest('.modal-row');
      jumbotronSectionGameplay.classList.remove('hidden');
      const jumbotron = document.querySelector('.jumbotron.top');
      if (jumbotron) {
        jumbotron.classList.remove('invisible');
      }
      
      // Hide bidding section
      const biddingSectionToHide = document.querySelector('.cols-bidding').closest('.row');
      if (biddingSectionToHide) {
        biddingSectionToHide.classList.add('hidden');
      }
      
      // Show gameplay section (the three-column layout)
      const gameplaySection = document.querySelector('.cols').closest('.row');
      if (gameplaySection) {
        gameplaySection.classList.remove('hidden');
        
        // Update player names in the UI
        if (window.gameplay && window.gameplay.updatePlayerNamesInUI) {
          window.gameplay.updatePlayerNamesInUI();
        }
        
        // Log the first trick information
        logTrickInfo();
        
        // Update the "First" pill to show only for the trick leader
        updateTrickLeaderPill();
      }
      
      // Show the .your-hand section and update its header for gameplay
      const yourHandSectionsGameplay = document.querySelectorAll('.your-hand');
      if (yourHandSectionsGameplay.length > 0) {
        yourHandSectionsGameplay[0].classList.remove('hidden'); // Show the first .your-hand section
        
        // Update the .your-hand-header-dealing to show power suit and bid information
        const yourHandHeader = yourHandSectionsGameplay[0].querySelector('.your-hand-header-dealing');
        if (yourHandHeader) {
          yourHandHeader.innerHTML = `
            <h2>Your hand</h2>
            <div class="pill">Power suit</div>
            <div class="power-suit-indicator ${gameState.roundState.powerSuit}"></div>
            <div class="pill">Bid</div>
            <div class="bid-indicator">${gameState.roundState.bidWinner} ${gameState.roundState.currentBid}</div>
            <img src="images/squiggle.png" width="300">
          `;
        } else {
          console.error('Could not find .your-hand-header-dealing element');
        }
        
        // Initialize card playing functionality AFTER the hand is visible
        if (window.gameplay && window.gameplay.initializeCardPlaying) {
          window.gameplay.initializeCardPlaying();
        }
      }
      break;
    case GAME_PHASES.ROUND_SCORING:
      // TODO: Show round scoring section
      break;
    case GAME_PHASES.END:
      // TODO: Show end section
      break;
    default:
      console.warn('Unknown phase:', currentPhase);
  }
}

/**
 * Handle Next button click during dealing phase - transition to bidding phase
 */
function handleDealingNextClick() {
  console.log('Dealing Next button clicked - transitioning to bidding phase');
  
  // Hide the Next button in the dealing section
  const dealingSection = document.querySelector('.your-hand:not(.hidden)');
  if (dealingSection) {
    const nextButton = dealingSection.querySelector('button');
    if (nextButton) {
      nextButton.style.display = 'none';
    }
  }
  
  // Transition to BIDDING phase
  setCurrentPhase(GAME_PHASES.BIDDING);
  updateUIForCurrentPhase();
}

/**
 * Handle Next button click during bidding phase - transition to gameplay phase
 */
function handleBiddingNextClick() {
  console.log('Bidding Next button clicked - transitioning to gameplay phase');
  
  // Log round information
  logRoundInfo();
  
  // Transition to GAMEPLAY phase
  setCurrentPhase(GAME_PHASES.GAMEPLAY);
  updateUIForCurrentPhase();
}

/**
 * Handle start button click - transition from welcome to dealing phase
 */
function handleStartButtonClick() {
  console.log('Start button clicked - initializing new game');
  
  // Complete NEW_GAME phase (initialize game state)
  setCurrentPhase(GAME_PHASES.NEW_GAME);
  initializeNewGame();
  
  // Complete NEW_ROUND phase (initialize round state)
  setCurrentPhase(GAME_PHASES.NEW_ROUND);
  initializeNewRound();
  
  // Transition to DEALING phase (show UI)
  setCurrentPhase(GAME_PHASES.DEALING);
  updateUIForCurrentPhase();
}

/**
 * Initialize a new game
 */
function initializeNewGame() {
  console.log('Initializing new game...');
  
  // Check if gameSetup is available
  if (!window.gameSetup) {
    console.error('gameSetup is not available. Check if setup.js is loaded properly.');
    return;
  }
  
  // Log player and team setup
  console.log('Setting up players and teams:');
  console.log('Players:', window.gameSetup.PLAYERS);
  console.log('Teams:', window.gameSetup.TEAMS);
  console.log('Game constants:', window.gameSetup.GAME_CONSTANTS);
  
  // Reset game-level state
  gameState.scores.team1 = 0;
  gameState.scores.team2 = 0;
  gameState.currentHand = 0;
  
  console.log('New game initialized with scores reset');
  console.log('Player setup complete - ready for gameplay');
}

/**
 * Initialize a new round
 */
function initializeNewRound() {
  console.log('Initializing new round...');
  
  // Check if cardLogic is available
  if (!window.cardLogic) {
    console.error('cardLogic is not available. Check if logic.js is loaded properly.');
    console.log('Available window objects:', Object.keys(window).filter(key => key.includes('card') || key.includes('logic')));
    return;
  }
  
  // Increment round counter
  gameState.currentHand++;
  
  // Initialize the round with shuffled deck and dealt hands
  const newGame = window.cardLogic.createNewGame();
  
  // Update game state with the new round data
  gameState.deck = newGame.deck;
  gameState.hands = newGame.hands;
  gameState.kitty = newGame.kitty;
  gameState.remainingDeck = newGame.remainingDeck;
  
  // Initialize round state (using static values for now)
  gameState.roundState = {
    currentBid: 150,
    bidWinner: "You",
    powerSuit: "orange",
    currentTrick: 0,
    trickLeader: "You", // starts as bid winner
    currentTurn: "You", // bid winner leads first trick
    turnOrder: ["Patricia", "Alex", "Jordan", "You"], // clockwise order
    playedCards: [],
    trickWinners: [],
    trickHistory: []
  };
  
  // Set the current player's hand (You are PLAYER3, position 3)
  gameState.playerHand = newGame.hands[3];
  
  console.log(`Round ${gameState.currentHand} initialized:`, {
    deckSize: gameState.deck.length,
    playerHandSize: gameState.playerHand.length,
    kittySize: gameState.kitty.length,
    playerHand: gameState.playerHand,
    kitty: gameState.kitty
  });
}



/**
 * Sort a hand of cards for display: group by color, then by value (1 highest, then 14, 13, etc., D last)
 * @param {Array} hand - Array of card objects
 * @returns {Array} Sorted hand for display
 */
function sortHandForDisplay(hand) {
  const sorted = [...hand];
  
  // Sort by suit first, then by value
  sorted.sort((a, b) => {
    // Sort by suit order (orange, yellow, blue, green, dunk)
    const suitOrder = ['orange', 'yellow', 'blue', 'green', 'dunk'];
    const aSuitIndex = suitOrder.indexOf(a.suit);
    const bSuitIndex = suitOrder.indexOf(b.suit);
    
    if (aSuitIndex !== bSuitIndex) {
      return aSuitIndex - bSuitIndex;
    }
    
    // Then by value (1 is highest, then 14, 13, 12, etc., D last)
    if (a.value === 1) return -1;
    if (b.value === 1) return 1;
    if (a.value === 'D') return 1;
    if (b.value === 'D') return -1;
    
    return b.value - a.value; // Higher numbers first
  });
  
  return sorted;
}

/**
 * Render a single card as HTML
 * @param {Object} card - Card object from cardLogic
 * @returns {string} HTML string for the card
 */
function renderCard(card) {
  const suit = card.suit;
  const value = card.value;
  
  return `<div class="card ${suit}"><p>${value} <span class="card-icon"></span></p></div>`;
}

/**
 * Deal cards animation - progressively reveal cards
 * @param {Array} playerHand - Array of card objects
 */
function dealCardsAnimation(playerHand) {
  console.log('Starting card dealing animation...');
  
  // Find the dealing section (only the first one should be visible)
  const dealingSection = document.querySelector('.your-hand:not(.hidden)');
  if (!dealingSection) {
    console.error('No visible dealing section found');
    return;
  }
  
  const modal = dealingSection.querySelector('.modal');
  const dealingText = dealingSection.querySelector('.dealing-text'); // Find h2 with dealing-text class
  
  if (!dealingText) {
    console.error('Dealing text not found');
    return;
  }
  
  console.log('Found dealing section:', dealingSection);
  
  // Create a card layout container if it doesn't exist
  let cardLayout = dealingSection.querySelector('.card-layout');
  if (!cardLayout) {
    cardLayout = document.createElement('div');
    cardLayout.className = 'card-layout hidden'; // Start hidden
    modal.appendChild(cardLayout);
  } else {
    cardLayout.innerHTML = ''; // Clear existing cards
    cardLayout.classList.add('hidden'); // Ensure it's hidden initially
  }
  
  // Sort the player hand for display: group by color, then by value (1 highest, then 14, 13, etc., D last)
  const sortedHand = sortHandForDisplay(playerHand);
  
  // Wait 1 second before starting to deal cards, keeping "DEALING..." text visible
  setTimeout(() => {
    // Swap visibility: hide dealing text and show card layout
    dealingText.classList.add('hidden');
    cardLayout.classList.remove('hidden');
    
    // Deal cards one by one in sorted order
    let cardIndex = 0;
    const dealInterval = setInterval(() => {
      if (cardIndex < sortedHand.length) {
        const card = sortedHand[cardIndex];
        const cardHTML = renderCard(card);
        cardLayout.insertAdjacentHTML('beforeend', cardHTML);
        cardIndex++;
        console.log(`Dealt card ${cardIndex}: ${card.suit} ${card.value}`);
      } else {
        // All cards dealt
        clearInterval(dealInterval);
        console.log('All cards dealt!');
        
        // Enable the Next button
        const nextButton = dealingSection.querySelector('button');
        if (nextButton) {
          nextButton.classList.remove('inactive');
          nextButton.textContent = 'Next ⮑';
          
          // Add event listener for Next button click
          nextButton.addEventListener('click', handleDealingNextClick, { once: true });
        }
      }
    }, 150); // 150ms delay between each card
  }, 1000); // 1 second delay before starting to deal cards
}

/**
 * Log round information when transitioning to gameplay
 */
function logRoundInfo() {
  console.log('=== ROUND INFORMATION ===');
  console.log(`Power Suit: ${gameState.roundState.powerSuit}`);
  console.log(`Bid: ${gameState.roundState.currentBid}`);
  console.log(`Bid Winner: ${gameState.roundState.bidWinner}`);
  console.log('');
  
  console.log('=== PLAYER HANDS ===');
  if (gameState.hands && gameState.hands.length === 4) {
    const players = window.gameSetup ? window.gameSetup.PLAYERS : ['Player 0', 'Player 1', 'Player 2', 'Player 3'];
    gameState.hands.forEach((hand, index) => {
      const playerName = players[`PLAYER${index}`] ? players[`PLAYER${index}`].name : `Player ${index}`;
      console.log(`${playerName} (${hand.length} cards):`, hand.map(card => `${card.suit} ${card.value}`).join(', '));
    });
  }
  console.log('');
  
  console.log('=== KITTY ===');
  if (gameState.kitty) {
    console.log(`Kitty (${gameState.kitty.length} cards):`, gameState.kitty.map(card => `${card.suit} ${card.value}`).join(', '));
  }
  console.log('');
}

/**
 * Log trick information at the start of each trick
 */
function logTrickInfo() {
  const currentTrick = gameState.roundState.currentTrick + 1;
  const trickLeader = gameState.roundState.trickLeader;
  
  console.log(`=== TRICK ${currentTrick}/13 ===`);
  console.log(`Trick Leader: ${trickLeader}`);
  console.log('');
}

/**
 * Update the "First" pill to show only for the current trick leader
 */
function updateTrickLeaderPill() {
  const trickLeader = gameState.roundState.trickLeader;
  const players = window.gameSetup ? window.gameSetup.PLAYERS : null;
  
  if (!players) {
    console.error('gameSetup not available for updating trick leader pill');
    return;
  }
  
  // Find all "First" pills in the play area
  const pills = document.querySelectorAll('.play-area .pill');
  
  pills.forEach((pill, index) => {
    // Determine which player this pill belongs to based on position
    let playerName;
    switch (index) {
      case 0: playerName = players.PLAYER0.name; break; // Patricia
      case 1: playerName = players.PLAYER1.name; break; // Alex
      case 2: playerName = players.PLAYER2.name; break; // Jordan
      case 3: playerName = players.PLAYER3.name; break; // You
      default: playerName = 'Unknown';
    }
    
    // Show pill only if this player is the trick leader
    if (playerName === trickLeader) {
      pill.classList.remove('invisible');
    } else {
      pill.classList.add('invisible');
    }
  });
}

/**
 * Tab functionality for score updates
 */
function activateTab(container, tabEl) {
  const tabs = container.querySelectorAll('.pill.tab');
  const panels = container.querySelectorAll('.tab-panel');

  tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
  panels.forEach(p => p.classList.add('is-hidden'));

  const panel = container.querySelector(tabEl.dataset.target);
  tabEl.classList.add('is-active');
  tabEl.setAttribute('aria-selected', 'true');
  if (panel) panel.classList.remove('is-hidden');
}

  document.addEventListener('click', e => {
    const tab = e.target.closest('.pill.tab[data-target]');
    if (!tab) return;
    activateTab(tab.closest('.score-update'), tab);
  });

  // Keyboard support: Enter or Space, plus Arrow Left/Right to move focus
  document.addEventListener('keydown', e => {
    const tab = e.target.closest('.pill.tab[data-target]');
    if (!tab) return;

    const container = tab.closest('.score-update');
    const tabs = [...container.querySelectorAll('.pill.tab')];
    const idx = tabs.indexOf(tab);

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateTab(container, tab);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = tabs[(idx + 1) % tabs.length];
      next.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      prev.focus();
    }
  });

  const infoBtn = document.querySelector('.info');
  const infoModal = document.getElementById('infoModal');
  const infoClose = infoModal.querySelector('.info-close');

  infoBtn.addEventListener('click', () => {
    infoModal.classList.add('active');
  });

  infoClose.addEventListener('click', () => {
    infoModal.classList.remove('active');
  });

  // Optional: close if clicking outside the modal box
  infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
      infoModal.classList.remove('active');
    }
  });

  // Initialize game state when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking dependencies...');
    
    // Check if cardLogic is available
    if (window.cardLogic) {
      console.log('cardLogic loaded successfully:', Object.keys(window.cardLogic));
    } else {
      console.error('cardLogic not found. Available window objects:', 
        Object.keys(window).filter(key => key.includes('card') || key.includes('logic')));
    }
    
    initializeGameState();
    
    // Add event listener for start button
    const startButton = document.querySelector('.get-started button');
    if (startButton) {
      startButton.addEventListener('click', handleStartButtonClick);
    }
  });

  // Export functions for testing and external use
  window.gameState = {
    getGameState,
    getCurrentPhase,
    setCurrentPhase,
    nextPhase,
    navigateToPhase,
    resetGame,
    initializeGameState,
    updateUIForCurrentPhase,
    handleStartButtonClick,
    handleDealingNextClick,
    handleBiddingNextClick,
    initializeNewGame,
    initializeNewRound,
    renderCard,
    dealCardsAnimation,
    logRoundInfo,
    logTrickInfo,
    updateTrickLeaderPill,
    GAME_PHASES
  };