
/**
 * Game State Management
 * Handles the current phase of the game and state transitions
 */

// Game phases in order of progression
const GAME_PHASES = {
  WELCOME: 'welcome',
  NEW_GAME: 'new_game',
  NEW_HAND: 'new_hand',
  DEALING: 'dealing', 
  BIDDING: 'bidding',
  GAMEPLAY: 'gameplay',
  SCORING: 'scoring',
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
  powerSuit: null,
  currentBid: 0,
  winningBidder: null,
  // Player data
  playerHand: null, // Current player's hand (hand[0])
  // Game progression
  currentHand: 0,
  currentTrick: 0,
  // Scores
  scores: {
    team1: 0, // You + Patricia
    team2: 0  // Patricia + Patricia
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
    powerSuit: null,
    currentBid: 0,
    winningBidder: null,
    // Player data
    playerHand: null,
    // Game progression
    currentHand: 0,
    currentTrick: 0,
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
    powerSuit: null,
    currentBid: 0,
    winningBidder: null,
    // Player data
    playerHand: null,
    // Game progression
    currentHand: 0,
    currentTrick: 0,
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
    case GAME_PHASES.NEW_HAND:
      // NEW_HAND is handled in background, no UI change needed
      break;
    case GAME_PHASES.DEALING:
      // Show jumbotron section (but keep jumbotron invisible)
      const jumbotronSection = document.querySelector('.jumbotron.top').closest('.modal-row');
      jumbotronSection.classList.remove('hidden');
      
      // Show the dealing sections - we need both the first (with "DEALING..." text) and second (with card-layout)
      const dealingSections = document.querySelectorAll('.your-hand');
      if (dealingSections.length > 1) {
        dealingSections[0].classList.remove('hidden'); // First section with "DEALING..." text
        dealingSections[1].classList.remove('hidden'); // Second section with card-layout
        
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
      // TODO: Show bidding section
      break;
    case GAME_PHASES.GAMEPLAY:
      // TODO: Show gameplay section
      break;
    case GAME_PHASES.SCORING:
      // TODO: Show scoring section
      break;
    case GAME_PHASES.END:
      // TODO: Show end section
      break;
    default:
      console.warn('Unknown phase:', currentPhase);
  }
}

/**
 * Handle start button click - transition from welcome to dealing phase
 */
function handleStartButtonClick() {
  console.log('Start button clicked - initializing new game');
  
  // Complete NEW_GAME phase (initialize game state)
  setCurrentPhase(GAME_PHASES.NEW_GAME);
  initializeNewGame();
  
  // Complete NEW_HAND phase (initialize hand state)
  setCurrentPhase(GAME_PHASES.NEW_HAND);
  initializeNewHand();
  
  // Transition to DEALING phase (show UI)
  setCurrentPhase(GAME_PHASES.DEALING);
  updateUIForCurrentPhase();
}

/**
 * Initialize a new game
 */
function initializeNewGame() {
  console.log('Initializing new game...');
  
  // Reset game-level state
  gameState.scores.team1 = 0;
  gameState.scores.team2 = 0;
  gameState.currentHand = 0;
  gameState.currentTrick = 0;
  
  console.log('New game initialized with scores reset');
}

/**
 * Initialize a new hand
 */
function initializeNewHand() {
  console.log('Initializing new hand...');
  
  // Check if cardLogic is available
  if (!window.cardLogic) {
    console.error('cardLogic is not available. Check if logic.js is loaded properly.');
    console.log('Available window objects:', Object.keys(window).filter(key => key.includes('card') || key.includes('logic')));
    return;
  }
  
  // Increment hand counter
  gameState.currentHand++;
  gameState.currentTrick = 0;
  
  // Initialize the game with shuffled deck and dealt hands
  const newGame = window.cardLogic.createNewGame();
  
  // Update game state with the new hand data
  gameState.deck = newGame.deck;
  gameState.hands = newGame.hands;
  gameState.kitty = newGame.kitty;
  gameState.remainingDeck = newGame.remainingDeck;
  gameState.powerSuit = newGame.powerSuit;
  gameState.currentBid = newGame.currentBid;
  gameState.winningBidder = newGame.winningBidder;
  
  // Set the current player's hand (assuming player is hand[0])
  gameState.playerHand = newGame.hands[0];
  
  console.log(`Hand ${gameState.currentHand} initialized:`, {
    deckSize: gameState.deck.length,
    playerHandSize: gameState.playerHand.length,
    kittySize: gameState.kitty.length,
    playerHand: gameState.playerHand,
    kitty: gameState.kitty
  });
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
  
  // Find the dealing sections
  const dealingSections = document.querySelectorAll('.your-hand');
  if (dealingSections.length === 0) {
    console.error('No dealing sections found');
    return;
  }
  
  // We need to work with the second dealing section (index 1) which has the card-layout
  const dealingSection = dealingSections[1]; // Second dealing section with card-layout
  const cardLayout = dealingSection.querySelector('.card-layout');
  const dealingText = dealingSections[0].querySelector('h2:last-of-type'); // "DEALING..." text from first section
  
  if (!cardLayout) {
    console.error('Card layout not found in dealing section');
    return;
  }
  
  if (!dealingText) {
    console.error('Dealing text not found');
    return;
  }
  
  console.log('Found elements:', { cardLayout: !!cardLayout, dealingText: !!dealingText });
  
  // Clear the card layout and dealing text
  cardLayout.innerHTML = '';
  dealingText.textContent = '';
  
  // Deal cards one by one
  let cardIndex = 0;
  const dealInterval = setInterval(() => {
    if (cardIndex < playerHand.length) {
      const card = playerHand[cardIndex];
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
      }
    }
  }, 150); // 150ms delay between each card
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
    initializeNewGame,
    initializeNewHand,
    renderCard,
    dealCardsAnimation,
    GAME_PHASES
  };