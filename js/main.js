
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
  KITTY: 'kitty',
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
    trickHistory: [], // history of all tricks in this round
    // Score tracking
    team1Score: 0,
    team2Score: 0,
    trickPoints: { team1: [], team2: [] }, // point cards won by each team
    pointCardsWon: { player1: [], player2: [], player3: [], player4: [] } // individual player point cards
  },
  // Player data
  playerHand: null, // Current player's hand (hand[0])
  // Game progression
  currentHand: 0,
  // Scores
  scores: {
    team1: 0,
    team2: 0
  },
  // Round history for hand-by-hand tracking
  roundHistory: [],
  // Bidding state
  biddingState: null,
  // Human kitty selection state
  humanKittySelection: null
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
    },
    // Round history for hand-by-hand tracking
    roundHistory: [],
    // Bidding state
    biddingState: null,
    // Human kitty selection state
    humanKittySelection: null
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
    },
    // Round history for hand-by-hand tracking
    roundHistory: [],
    // Bidding state
    biddingState: null,
    // Human kitty selection state
    humanKittySelection: null
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
      
      // Hide all dealing sections first to ensure clean state
      const allDealingSections = document.querySelectorAll('.your-hand');
      allDealingSections.forEach(section => {
        section.classList.add('hidden');
      });
      
      // Show only the first dealing section initially (the one with "DEALING..." text)
      if (allDealingSections.length > 0) {
        const firstDealingSection = allDealingSections[0];
        firstDealingSection.classList.remove('hidden');
        
        // Reset the dealing section to initial state
        const dealingText = firstDealingSection.querySelector('.dealing-text');
        const cardLayout = firstDealingSection.querySelector('.card-layout');
        const nextButton = firstDealingSection.querySelector('button');
        
        if (dealingText) {
          dealingText.classList.remove('hidden'); // Show "DEALING..." text
        }
        if (cardLayout) {
          cardLayout.classList.add('hidden'); // Hide any existing cards
          cardLayout.innerHTML = ''; // Clear existing cards
        }
        if (nextButton) {
          nextButton.classList.add('inactive'); // Reset button to inactive state
          nextButton.textContent = 'Next ⮑';
          nextButton.style.display = ''; // Reset display style
        }
        
        // Update the header to show simple dealing header without bid/power suit info
        const yourHandHeader = firstDealingSection.querySelector('.your-hand-header-dealing');
        if (yourHandHeader) {
          yourHandHeader.innerHTML = `
            <img src="images/squiggle.png" width="300">
            <h2>Your hand</h2>
            <img src="images/squiggle.png" width="300">
          `;
        }
        
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
        
        // Hide the Next button initially (will be shown when bidding completes)
        const nextButton = biddingSection.querySelector('.right button');
        if (nextButton) {
          nextButton.style.display = 'none';
        }
      }
      
      // Show the .your-hand section (the one that was visible during dealing)
      const yourHandSections = document.querySelectorAll('.your-hand');
      if (yourHandSections.length > 0) {
        yourHandSections[0].classList.remove('hidden'); // Show the first .your-hand section
      }
      
      // Initialize bidding phase
      initializeBiddingPhase();
      break;
    case GAME_PHASES.KITTY:
      // Show jumbotron section (but keep jumbotron invisible)
      const jumbotronSectionKitty = document.querySelector('.jumbotron.top').closest('.modal-row');
      jumbotronSectionKitty.classList.remove('hidden');
      
      // Hide bidding section
      const biddingSectionToHideKitty = document.querySelector('.cols-bidding').closest('.row');
      if (biddingSectionToHideKitty) {
        biddingSectionToHideKitty.classList.add('hidden');
      }
      
      // Show the .your-hand section and update its header for kitty phase
      const yourHandSectionsKitty = document.querySelectorAll('.your-hand');
      if (yourHandSectionsKitty.length > 0) {
        yourHandSectionsKitty[0].classList.remove('hidden');
        
        // Update the header to show bid and power suit information
        const yourHandHeader = yourHandSectionsKitty[0].querySelector('.your-hand-header-dealing');
        if (yourHandHeader) {
          yourHandHeader.innerHTML = `
            <h2>Your hand</h2>
            <div class="pill">Power suit</div>
            <div class="power-suit-indicator tbd">TBD</div>
            <div class="pill">Bid</div>
            <div class="bid-indicator">${gameState.roundState.bidWinner} ${gameState.roundState.currentBid}</div>
            <img src="images/squiggle.png" width="300">
          `;
        }
      }
      
      // Show appropriate kitty section based on who won the bid
      const bidWinner = gameState.roundState.bidWinner;
      const isHumanWinner = bidWinner === window.gameSetup.PLAYERS.PLAYER3.name;
      
      if (isHumanWinner) {
        // Show human kitty section - look for the section with kitty-power-selection
        const humanKittySection = document.querySelector('.row.modal-row.your-hand:has(.kitty-power-selection)');
        console.log('Human kitty section found:', humanKittySection);
        if (humanKittySection) {
          humanKittySection.classList.remove('hidden');
          console.log('Human kitty section shown');
          
          // Initialize human kitty management
          initializeHumanKitty();
        } else {
          console.log('Human kitty section not found');
        }
      } else {
        // Show computer kitty section
        const computerKittySection = document.querySelector('.row:has(.kitty-computer)');
        console.log('Computer kitty section found:', computerKittySection);
        if (computerKittySection) {
          computerKittySection.classList.remove('hidden');
          console.log('Computer kitty section shown');
          
          // Handle computer kitty logic
          const computerPlayer = gameState.roundState.bidWinner;
          const computerHandIndex = getPlayerHandIndex(computerPlayer);
          const computerHand = gameState.hands[computerHandIndex];
          const kitty = gameState.kitty;
          
          // Process computer kitty management
          const kittyResult = window.cardLogic.handleComputerKitty(computerPlayer, computerHand, kitty);
          
          // Update game state
          gameState.hands[computerHandIndex] = kittyResult.newHand;
          gameState.kitty = kittyResult.newKitty;
          gameState.roundState.powerSuit = kittyResult.powerSuit;
          
          // Start computer kitty animation
          animateComputerKitty(computerPlayer, gameState.roundState.currentBid, kittyResult.powerSuit);
        } else {
          console.log('Computer kitty section not found');
        }
      }
      
      // Set up event listeners for kitty "Let's go" buttons
      setTimeout(() => {
        if (isHumanWinner) {
          // Set up human kitty button listener
          const humanKittyButton = document.querySelector('.kitty-container .checklist button');
          console.log('Setting up human kitty button listener:', humanKittyButton);
          
          if (humanKittyButton) {
            humanKittyButton.addEventListener('click', handleKittyNextClick, { once: true });
            console.log('Added click listener to human kitty button');
          }
        } else {
          // Set up computer kitty button listener - look specifically in the visible computer kitty section
          const computerKittyButton = document.querySelector('.computer-kitty-button');
          console.log('Setting up computer kitty button listener:', computerKittyButton);
          
          if (computerKittyButton) {
            computerKittyButton.style.display = 'none'; // Hide initially
            computerKittyButton.addEventListener('click', handleKittyNextClick, { once: true });
            console.log('Added click listener to computer kitty button');
          }
        }
      }, 100); // Small delay to ensure DOM is updated
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
      
      // Hide computer kitty section
      const computerKittySection = document.querySelector('.row:has(.kitty-computer)');
      if (computerKittySection) {
        computerKittySection.classList.add('hidden');
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
      // Round scoring section is already shown by the transition function
      // Button event listener is set up in showRoundScoringSection()
      break;
    case GAME_PHASES.END:
      // End game modal is shown by showEndGameModal() function
      // No additional UI updates needed here
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
 * Handle Next button click during bidding phase - transition to kitty phase
 */
function handleBiddingNextClick() {
  console.log('Bidding Next button clicked - transitioning to kitty phase');
  
  // Transition to KITTY phase
  setCurrentPhase(GAME_PHASES.KITTY);
  updateUIForCurrentPhase();
}

/**
 * Handle "Let's go" button click during kitty phase - transition to gameplay phase
 */
function handleKittyNextClick() {
  console.log('Kitty "Let\'s go" button clicked - transitioning to gameplay phase');
  
  // Check if this is human kitty management
  if (gameState.humanKittySelection) {
    // Process human kitty selections
    const selectedCards = getSelectedCards();
    const powerSuit = gameState.humanKittySelection.powerSuit;
    
    if (selectedCards.length !== 5 || !powerSuit) {
      console.error('Invalid human kitty selection');
      return;
    }
    
    // Process human kitty management
    const kittyResult = window.cardLogic.handleHumanKitty(
      gameState.playerHand, 
      gameState.kitty, 
      selectedCards, 
      powerSuit
    );
    
    // Update game state
    gameState.playerHand = kittyResult.newHand;
    gameState.kitty = kittyResult.newKitty;
    gameState.roundState.powerSuit = kittyResult.powerSuit;
    
    // Keep gameState.hands in sync for consistency
    gameState.hands[3] = kittyResult.newHand;
    
    // Update the UI to reflect the new hand
    updatePlayerHandDisplay();
    
    console.log('Human kitty management completed');
  }
  
  // Set the trick leader to the bid winner
  gameState.roundState.trickLeader = gameState.roundState.bidWinner;
  gameState.roundState.currentTurn = gameState.roundState.bidWinner;
  
  console.log(`Trick leader set to: ${gameState.roundState.trickLeader}`);
  
  // Clean up kitty phase selections
  cleanupKittyPhase();
  
  // Log round information
  logRoundInfo();
  
  // Transition to GAMEPLAY phase
  setCurrentPhase(GAME_PHASES.GAMEPLAY);
  updateUIForCurrentPhase();
}

/**
 * Update computer kitty header with player name and bid
 * @param {string} playerName - Name of the computer player
 * @param {number} bidAmount - Winning bid amount
 */
function updateComputerKittyHeader(playerName, bidAmount) {
  const playerNameElement = document.querySelector('.kitty-computer .player-name');
  const playerBidElement = document.querySelector('.kitty-computer .player-bid');
  
  if (playerNameElement) {
    playerNameElement.textContent = playerName;
  }
  
  if (playerBidElement) {
    playerBidElement.textContent = bidAmount;
  }
}

/**
 * Show first step in computer kitty animation
 */
function showFirstStep() {
  const firstStep = document.querySelector('.kitty-computer .step-1 img');
  if (firstStep) {
    firstStep.classList.remove('invisible');
    console.log('Computer kitty step 1: Look through the kitty');
  }
}

/**
 * Show second step in computer kitty animation
 */
function showSecondStep() {
  const secondStep = document.querySelector('.kitty-computer .step-2 img');
  if (secondStep) {
    secondStep.classList.remove('invisible');
    console.log('Computer kitty step 2: Pick a power suit');
  }
}

/**
 * Show power suit selection in computer kitty animation
 * @param {string} powerSuit - Chosen power suit
 */
function showPowerSuit(powerSuit) {
  const powerSuitDisplay = document.querySelector('.kitty-computer .power-suit-display');
  const powerSuitText = document.querySelector('.kitty-computer .power-suit-text');
  
  if (powerSuitDisplay && powerSuitText) {
    // Update color class
    powerSuitDisplay.className = `power-suit ${powerSuit} power-suit-display`;
    
    // Update text based on suit
    const suitNames = {
      orange: 'Gatorade orange',
      yellow: 'Mellow yellow', 
      blue: 'Bottled water',
      green: 'Baja blast green'
    };
    
    powerSuitText.textContent = suitNames[powerSuit] || powerSuit;
    console.log(`Computer kitty power suit: ${powerSuit} (${suitNames[powerSuit]})`);
  }
}

/**
 * Show "Let's go" button after computer kitty animations complete
 */
function showComputerKittyButton() {
  const computerKittyButton = document.querySelector('.computer-kitty-button');
  console.log('Looking for computer kitty button:', computerKittyButton);
  
  if (computerKittyButton) {
    computerKittyButton.style.display = 'block';
    computerKittyButton.style.visibility = 'visible';
    computerKittyButton.style.opacity = '1';
    console.log('Computer kitty "Let\'s go" button shown');
  } else {
    console.error('Computer kitty button not found!');
  }
}

/**
 * Animate computer kitty phase
 * @param {string} computerPlayer - Name of the computer player
 * @param {number} winningBid - Winning bid amount
 * @param {string} powerSuit - Chosen power suit
 */
function animateComputerKitty(computerPlayer, winningBid, powerSuit) {
  console.log(`Starting computer kitty animation for ${computerPlayer}`);
  
  // Update header immediately
  updateComputerKittyHeader(computerPlayer, winningBid);
  
  // Sequential animations
  setTimeout(() => showFirstStep(), 500);
  setTimeout(() => showSecondStep(), 1000);
  setTimeout(() => showPowerSuit(powerSuit), 1500);
  setTimeout(() => showComputerKittyButton(), 2000); // Show button after all animations
}

/**
 * Initialize human kitty management
 */
function initializeHumanKitty() {
  console.log('Initializing human kitty management...');
  
  // Get current game state
  const playerHand = gameState.playerHand;
  const kitty = gameState.kitty;
  
  // Populate kitty display
  populateKittyDisplay(kitty);
  
  // Set up card selection interface
  setupCardSelection();
  
  // Set up power suit selection
  setupPowerSuitSelection();
  
  // Initialize checklist
  updateHumanKittyChecklist();
}

/**
 * Populate the kitty display with actual kitty cards
 * @param {Array} kitty - Kitty cards to display
 */
function populateKittyDisplay(kitty) {
  const kittyLayout = document.querySelector('.pick-kitty .card-layout');
  if (!kittyLayout) return;
  
  // Clear existing cards
  kittyLayout.innerHTML = '';
  
  // Add kitty cards
  kitty.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.suit} kitty-card`;
    cardElement.dataset.suit = card.suit;
    cardElement.dataset.value = card.value;
    cardElement.innerHTML = `<p>${card.value} <span class="card-icon"></span></p>`;
    
    // Create a named function for the event handler
    const clickHandler = (event) => {
      event.stopPropagation(); // Prevent event bubbling
      toggleCardSelection(cardElement, card);
    };
    
    // Store the handler reference for potential removal later
    cardElement._kittySelectionHandler = clickHandler;
    
    // Add click handler for selection
    cardElement.addEventListener('click', clickHandler);
    
    kittyLayout.appendChild(cardElement);
  });
  
  // Kitty display populated
}

/**
 * Set up card selection interface
 */
function setupCardSelection() {
  // Add click handlers to player's hand cards
  const playerCards = document.querySelectorAll('.your-hand .card-layout .card');
  playerCards.forEach(cardElement => {
    // Remove any existing kitty selection event listeners
    cardElement.removeEventListener('click', cardElement._kittySelectionHandler);
    
    const card = {
      suit: cardElement.classList.contains('orange') ? 'orange' : 
            cardElement.classList.contains('yellow') ? 'yellow' : 
            cardElement.classList.contains('blue') ? 'blue' : 
            cardElement.classList.contains('green') ? 'green' : 'dunk',
      value: cardElement.textContent.trim().split(' ')[0]
    };
    
    // Create a named function for the event handler
    const clickHandler = (event) => {
      event.stopPropagation(); // Prevent event bubbling
      toggleCardSelection(cardElement, card);
    };
    
    // Store the handler reference for potential removal later
    cardElement._kittySelectionHandler = clickHandler;
    
    cardElement.addEventListener('click', clickHandler);
  });
}

/**
 * Toggle card selection
 * @param {HTMLElement} cardElement - The card element
 * @param {Object} card - The card data
 */
function toggleCardSelection(cardElement, card) {
  console.log('toggleCardSelection called for:', card.suit, card.value);
  
  const isSelected = cardElement.classList.contains('selected');
  console.log('Card is currently selected:', isSelected);
  
  if (isSelected) {
    // Deselect card
    console.log('Deselecting card:', card.suit, card.value);
    cardElement.classList.remove('selected');
    removeCardFromSelection(card);
  } else {
    // Check if we can select more cards (max 5)
    const selectedCards = getSelectedCards();
    console.log('Currently selected cards:', selectedCards.length);
    if (selectedCards.length >= 5) {
      console.log('Maximum 5 cards can be selected');
      return;
    }
    
    // Select card
    console.log('Selecting card:', card.suit, card.value);
    cardElement.classList.add('selected');
    addCardToSelection(card);
  }
  
  // Update checklist
  updateHumanKittyChecklist();
}

/**
 * Get currently selected cards
 * @returns {Array} Array of selected card objects
 */
function getSelectedCards() {
  const selectedElements = document.querySelectorAll('.card.selected');
  const selectedCards = [];
  
  selectedElements.forEach(element => {
    const card = {
      suit: element.dataset.suit || 
            (element.classList.contains('orange') ? 'orange' : 
             element.classList.contains('yellow') ? 'yellow' : 
             element.classList.contains('blue') ? 'blue' : 
             element.classList.contains('green') ? 'green' : 'dunk'),
      value: element.dataset.value || element.textContent.trim().split(' ')[0]
    };
    
    // Convert value to number if it's a number
    if (!isNaN(card.value)) {
      card.value = parseInt(card.value);
    }
    
    selectedCards.push(card);
  });
  
  return selectedCards;
}

/**
 * Add card to selection tracking
 * @param {Object} card - Card to add
 */
function addCardToSelection(card) {
  if (!gameState.humanKittySelection) {
    gameState.humanKittySelection = { selectedCards: [], powerSuit: null };
  }
  
  // Check if card is already selected
  const isAlreadySelected = gameState.humanKittySelection.selectedCards.some(
    selected => selected.suit === card.suit && selected.value === card.value
  );
  
  if (!isAlreadySelected) {
    gameState.humanKittySelection.selectedCards.push(card);
    console.log('Card added to selection:', card.suit, card.value);
  }
}

/**
 * Remove card from selection tracking
 * @param {Object} card - Card to remove
 */
function removeCardFromSelection(card) {
  if (!gameState.humanKittySelection) return;
  
  gameState.humanKittySelection.selectedCards = gameState.humanKittySelection.selectedCards.filter(
    selected => !(selected.suit === card.suit && selected.value === card.value)
  );
  
  console.log('Card removed from selection:', card.suit, card.value);
}

/**
 * Set up power suit selection
 */
function setupPowerSuitSelection() {
  const powerSuitOptions = document.querySelectorAll('.power-suit-list .power-suit');
  
  powerSuitOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selection from all options
      powerSuitOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Add selection to clicked option
      option.classList.add('selected');
      
      // Get the power suit from the class name
      const powerSuit = option.classList.contains('orange') ? 'orange' :
                       option.classList.contains('yellow') ? 'yellow' :
                       option.classList.contains('blue') ? 'blue' :
                       option.classList.contains('green') ? 'green' : null;
      
      if (powerSuit) {
        if (!gameState.humanKittySelection) {
          gameState.humanKittySelection = { selectedCards: [], powerSuit: null };
        }
        gameState.humanKittySelection.powerSuit = powerSuit;
        console.log('Power suit selected:', powerSuit);
        
        // Update checklist
        updateHumanKittyChecklist();
      }
    });
  });
}

/**
 * Update the human kitty checklist
 */
function updateHumanKittyChecklist() {
  const checklistItems = document.querySelectorAll('.checklist .item');
  const letsGoButton = document.querySelector('.checklist button');
  
  if (!checklistItems.length) return;
  
  const selectedCards = getSelectedCards();
  const powerSuit = gameState.humanKittySelection?.powerSuit;
  
  // Update first checklist item (card selection)
  const cardSelectionItem = checklistItems[0];
  const cardSelectionImg = cardSelectionItem.querySelector('img');
  
  if (selectedCards.length === 5) {
    cardSelectionImg.src = 'images/check.png';
    cardSelectionItem.classList.add('completed');
  } else {
    cardSelectionImg.src = 'images/dot.png';
    cardSelectionItem.classList.remove('completed');
  }
  
  // Update second checklist item (power suit selection)
  const powerSuitItem = checklistItems[1];
  const powerSuitImg = powerSuitItem.querySelector('img');
  
  if (powerSuit) {
    powerSuitImg.src = 'images/check.png';
    powerSuitItem.classList.add('completed');
  } else {
    powerSuitImg.src = 'images/dot.png';
    powerSuitItem.classList.remove('completed');
  }
  
  // Enable/disable "Let's go" button
  if (selectedCards.length === 5 && powerSuit) {
    letsGoButton.disabled = false;
    letsGoButton.classList.remove('inactive');
  } else {
    letsGoButton.disabled = true;
    letsGoButton.classList.add('inactive');
  }
}

/**
 * Update the player's hand display in the UI
 */
function updatePlayerHandDisplay() {
  const playerHandLayout = document.querySelector('.your-hand .card-layout');
  if (!playerHandLayout || !gameState.playerHand) return;
  
  // Clear existing cards
  playerHandLayout.innerHTML = '';
  
  // Sort the hand using the existing sorting logic
  const sortedHand = window.cardLogic.sortHand(gameState.playerHand);
  
  // Add sorted cards from game state
  sortedHand.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.suit}`;
    cardElement.dataset.suit = card.suit;
    cardElement.dataset.value = card.value;
    cardElement.innerHTML = `<p>${card.value} <span class="card-icon"></span></p>`;
    
    playerHandLayout.appendChild(cardElement);
  });
  
  // Player hand display updated
}

/**
 * Clean up kitty phase selections
 */
function cleanupKittyPhase() {
  // Remove selected class from all cards
  const selectedCards = document.querySelectorAll('.card.selected');
  selectedCards.forEach(card => {
    card.classList.remove('selected');
  });
  
  // Remove selected class from power suit options
  const selectedPowerSuits = document.querySelectorAll('.power-suit.selected');
  selectedPowerSuits.forEach(powerSuit => {
    powerSuit.classList.remove('selected');
  });
  
  // Clear human kitty selection state
  gameState.humanKittySelection = null;
}

/**
 * Initialize bidding phase with dynamic UI
 */
function initializeBiddingPhase() {
  console.log('Initializing bidding phase...');
  
  // Start a new bidding round
  const roundNumber = gameState.currentHand;
  const biddingState = window.cardLogic.startBiddingRound(roundNumber);
  
  // Store bidding state in game state
  gameState.biddingState = biddingState;
  
  // Clear any existing bid display
  clearBiddingDisplay();
  
  // Start the bidding process
  processNextBid();
}

/**
 * Clear the bidding display
 */
function clearBiddingDisplay() {
  const biddingDetails = document.getElementById('biddingDetails');
  if (biddingDetails) {
    biddingDetails.innerHTML = '';
  }
  
  // Hide error message
  hideBidError();
}

/**
 * Process the next bid in the bidding round
 */
function processNextBid() {
  if (!gameState.biddingState || window.cardLogic.isBiddingComplete(gameState.biddingState)) {
    // Bidding is complete, transition to kitty management
    handleBiddingComplete();
    return;
  }
  
  const currentPlayer = window.cardLogic.getCurrentBidder(gameState.biddingState);
  const isHumanTurn = currentPlayer === window.gameSetup.PLAYERS.PLAYER3.name;
  
  if (isHumanTurn) {
    // Show human bidding form
    showHumanBidForm();
  } else {
    // AI turn - make decision after a thinking delay
    processAIBid(currentPlayer);
  }
}

/**
 * Process AI bid with thinking delay
 */
function processAIBid(aiPlayerName) {
  console.log(`${aiPlayerName} is thinking...`);
  
  // Get AI player's hand
  const aiHandIndex = getPlayerHandIndex(aiPlayerName);
  const aiHand = gameState.hands[aiHandIndex];
  
  // AI thinking delay (0.5-1 seconds)
  const thinkingDelay = 500 + Math.random() * 500;
  
  setTimeout(() => {
    // Make AI decision
    const aiDecision = window.cardLogic.makeAIBidDecision(aiPlayerName, aiHand, gameState.biddingState);
    
    if (aiDecision.action === 'bid') {
      // AI makes a bid
      gameState.biddingState = window.cardLogic.makeBid(gameState.biddingState, aiPlayerName, aiDecision.amount);
      addBidToDisplay(aiPlayerName, aiDecision.amount);
    } else {
      // AI passes
      gameState.biddingState = window.cardLogic.passBid(gameState.biddingState, aiPlayerName);
      addPassToDisplay(aiPlayerName);
    }
    
    // Process next bid
    setTimeout(() => {
      processNextBid();
    }, 500); // Small delay before next player
    
  }, thinkingDelay);
}

/**
 * Get player hand index by player name
 */
function getPlayerHandIndex(playerName) {
  const players = window.gameSetup.PLAYERS;
  if (playerName === players.PLAYER0.name) return 0; // Patricia
  if (playerName === players.PLAYER1.name) return 1; // Alex
  if (playerName === players.PLAYER2.name) return 2; // Jordan
  if (playerName === players.PLAYER3.name) return 3; // You
  return -1;
}

/**
 * Show human bidding form
 */
function showHumanBidForm() {
  const humanBidForm = document.getElementById('humanBidForm');
  const bidInput = document.getElementById('bidInput');
  const bidButton = document.getElementById('bidButton');
  const passButton = document.getElementById('passButton');
  
  if (humanBidForm && bidInput) {
    humanBidForm.style.display = 'block';
    bidInput.focus();
    
    // Set minimum bid value
    const currentHighestBid = gameState.biddingState.highestBid;
    const minBid = currentHighestBid === 0 ? 70 : currentHighestBid + 5;
    bidInput.min = minBid;
    bidInput.placeholder = `Min: ${minBid}`;
    
    // Enable buttons
    if (bidButton) bidButton.classList.remove('inactive');
    if (passButton) passButton.classList.remove('inactive');
  }
}

/**
 * Hide human bidding form
 */
function hideHumanBidForm() {
  const humanBidForm = document.getElementById('humanBidForm');
  const bidButton = document.getElementById('bidButton');
  const passButton = document.getElementById('passButton');
  
  if (humanBidForm) {
    humanBidForm.style.display = 'none';
  }
  
  // Disable buttons
  if (bidButton) bidButton.classList.add('inactive');
  if (passButton) passButton.classList.add('inactive');
}

/**
 * Add a bid to the display
 */
function addBidToDisplay(playerName, amount) {
  const biddingDetails = document.getElementById('biddingDetails');
  if (!biddingDetails) return;
  
  const bidElement = document.createElement('div');
  bidElement.className = 'bid';
  bidElement.innerHTML = `
    <p class="player-name">${playerName}</p>
    <p class="player-bid">${amount}</p>
  `;
  
  biddingDetails.appendChild(bidElement);
  
  // Scroll to bottom to show latest bid
  biddingDetails.scrollTop = biddingDetails.scrollHeight;
}

/**
 * Add a pass to the display
 */
function addPassToDisplay(playerName) {
  const biddingDetails = document.getElementById('biddingDetails');
  if (!biddingDetails) return;
  
  const passElement = document.createElement('div');
  passElement.className = 'bid pass';
  passElement.innerHTML = `
    <p class="player-name">${playerName}</p>
    <p class="player-bid">Pass</p>
  `;
  
  biddingDetails.appendChild(passElement);
  
  // Scroll to bottom to show latest pass
  biddingDetails.scrollTop = biddingDetails.scrollHeight;
}

/**
 * Handle human bid submission
 */
function handleBidSubmit(event) {
  event.preventDefault();
  
  const bidInput = document.getElementById('bidInput');
  const bidAmount = parseInt(bidInput.value);
  
  try {
    // Make the bid
    gameState.biddingState = window.cardLogic.makeBid(gameState.biddingState, window.gameSetup.PLAYERS.PLAYER3.name, bidAmount);
    
    // Add bid to display
    addBidToDisplay(window.gameSetup.PLAYERS.PLAYER3.name, bidAmount);
    
    // Hide form and clear input
    hideHumanBidForm();
    bidInput.value = '';
    hideBidError();
    
    // Process next bid
    setTimeout(() => {
      processNextBid();
    }, 500);
    
  } catch (error) {
    // Show validation error
    showBidError(error.message);
  }
}

/**
 * Handle human pass
 */
function handlePassClick() {
  // Make the pass
  gameState.biddingState = window.cardLogic.passBid(gameState.biddingState, window.gameSetup.PLAYERS.PLAYER3.name);
  
  // Add pass to display
  addPassToDisplay(window.gameSetup.PLAYERS.PLAYER3.name);
  
  // Hide form
  hideHumanBidForm();
  hideBidError();
  
  // Process next bid
  setTimeout(() => {
    processNextBid();
  }, 500);
}

/**
 * Show bid error message
 */
function showBidError(message) {
  const errorElement = document.getElementById('bidError');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

/**
 * Hide bid error message
 */
function hideBidError() {
  const errorElement = document.getElementById('bidError');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

/**
 * Handle bidding completion
 */
function handleBiddingComplete() {
  console.log('Bidding complete!');
  
  const result = window.cardLogic.getBiddingResult(gameState.biddingState);
  console.log('Bidding result:', result);
  
  // Update game state with bidding results
  gameState.roundState.currentBid = result.winningBid;
  gameState.roundState.bidWinner = result.winner;
  
  // Hide human bidding form
  hideHumanBidForm();
  
  // Mark the winning bid in the display with a small delay
  setTimeout(() => {
    markWinningBid(result.winner, result.winningBid);
    
    // Show "Next" button after winner announcement
    setTimeout(() => {
      const nextButton = document.querySelector('.cols-bidding .right button');
      if (nextButton) {
        nextButton.style.display = 'block';
        nextButton.addEventListener('click', handleBiddingNextClick, { once: true });
      }
    }, 500); // Additional 500ms delay after winner announcement
  }, 500);
}

/**
 * Mark the winning bid in the display
 */
function markWinningBid(winner, winningBid) {
  const biddingDetails = document.getElementById('biddingDetails');
  if (!biddingDetails) return;
  
  // Add a new announcement line for the winner
  const winnerElement = document.createElement('div');
  winnerElement.className = 'bid win-bid';
  winnerElement.innerHTML = `
    <p class="player-name">${winner}</p>
    <p class="player-bid">${winningBid}</p>
  `;
  
  biddingDetails.appendChild(winnerElement);
  
  // Scroll to bottom to show the winner announcement
  biddingDetails.scrollTop = biddingDetails.scrollHeight;
}

/**
 * Handle Next button click during round scoring phase - transition to score update phase
 */
function handleRoundScoringNextClick() {
  console.log('Round scoring Next button clicked - transitioning to score update phase');
  
  // Hide the round scoring section (hand-score)
  const handScoreSections = document.querySelectorAll('.row');
  handScoreSections.forEach(section => {
    if (section.querySelector('.hand-score')) {
      section.classList.add('hidden');
    }
  });
  
  // Show the score update section
  const scoreUpdateSections = document.querySelectorAll('.row');
  scoreUpdateSections.forEach(section => {
    if (section.querySelector('.score-update')) {
      section.classList.remove('hidden');
    }
  });
  
  // Populate the score update section with real data
  populateScoreUpdateData();
  
  // Set up the Next button in the score update section
  const scoreUpdateNextButton = document.querySelector('.score-update').closest('.row').querySelector('.right button');
  if (scoreUpdateNextButton) {
    scoreUpdateNextButton.onclick = handleScoreUpdateNextClick;
  }
}

/**
 * Populate the score update section with actual game data
 */
function populateScoreUpdateData() {
  if (!window.gameplay || !window.gameplay.getCurrentGameScores) {
    console.error('Gameplay functions not available');
    return;
  }
  
  const scores = window.gameplay.getCurrentGameScores();
  const roundHistory = window.gameplay.getRoundHistory();
  
  // Update overall scores in the score update jumbotron
  const scoreUpdateJumbotronScores = document.querySelectorAll('.score-update .jumbotron .scorebox p');
  if (scoreUpdateJumbotronScores.length >= 2) {
    scoreUpdateJumbotronScores[0].textContent = scores.team1Score;
    scoreUpdateJumbotronScores[1].textContent = scores.team2Score;
  }
  
  // Update team names in the score update jumbotron
  const scoreUpdateJumbotronTeams = document.querySelectorAll('.score-update .jumbotron .scoreboard-team p');
  if (scoreUpdateJumbotronTeams.length >= 2) {
    scoreUpdateJumbotronTeams[0].textContent = scores.team1Name;
    scoreUpdateJumbotronTeams[1].textContent = scores.team2Name;
  }
  
  // Update the top jumbotron with current game scores
  const topJumbotronScores = document.querySelectorAll('.jumbotron.top .scorebox p');
  if (topJumbotronScores.length >= 2) {
    topJumbotronScores[0].textContent = scores.team1Score;
    topJumbotronScores[1].textContent = scores.team2Score;
  }
  
  // Update team names in the top jumbotron
  const topJumbotronTeams = document.querySelectorAll('.jumbotron.top .scoreboard-team p');
  if (topJumbotronTeams.length >= 2) {
    topJumbotronTeams[0].textContent = scores.team1Name;
    topJumbotronTeams[1].textContent = scores.team2Name;
  }
  
  // Update hand-by-hand table
  populateHandByHandTable(roundHistory);
}

/**
 * Handle Next button click during score update phase - transition to next round or end game
 */
function handleScoreUpdateNextClick() {
  console.log('Score update Next button clicked');
  
  // Check if game should end (either team has 500+ points)
  if (!window.gameplay || !window.gameplay.checkForGameEnd) {
    console.error('Gameplay functions not available');
    return;
  }
  
  const gameState = window.gameState.getGameState();
  const winningScore = window.gameSetup.GAME_CONSTANTS.WINNING_SCORE;
  
  if (gameState.scores.team1 >= winningScore || gameState.scores.team2 >= winningScore) {
    // Game should end - transition to end game phase
    console.log('Game end detected - transitioning to end game phase');
    
    // Determine winner
    let winner = null;
    if (gameState.scores.team1 >= winningScore && gameState.scores.team2 >= winningScore) {
      // Both teams reached 500 - highest score wins
      if (gameState.scores.team1 > gameState.scores.team2) {
        winner = 'team1';
      } else if (gameState.scores.team2 > gameState.scores.team1) {
        winner = 'team2';
      } else {
        // Tie - winner of most recent round wins
        const lastRound = gameState.roundHistory[gameState.roundHistory.length - 1];
        if (lastRound.team1Final > lastRound.team2Final) {
          winner = 'team1';
        } else {
          winner = 'team2';
        }
      }
    } else if (gameState.scores.team1 >= winningScore) {
      winner = 'team1';
    } else {
      winner = 'team2';
    }
    
    // Transition to end game phase
    setCurrentPhase(GAME_PHASES.END);
    if (window.gameplay && window.gameplay.showEndGameModal) {
      window.gameplay.showEndGameModal(winner);
    }
  } else {
    // Start next round - transition to NEW_ROUND phase
    console.log('Starting next round');
    
    // Hide the score update section
    const scoreUpdateSections = document.querySelectorAll('.row');
    scoreUpdateSections.forEach(section => {
      if (section.querySelector('.score-update')) {
        section.classList.add('hidden');
      }
    });
    
    // Initialize new round (this increments the round number and preserves scores)
    setCurrentPhase(GAME_PHASES.NEW_ROUND);
    initializeNewRound();
    
    // Transition to DEALING phase and update UI
    setCurrentPhase(GAME_PHASES.DEALING);
    updateUIForCurrentPhase();
  }
}

/**
 * Populate the hand-by-hand table with round history
 */
function populateHandByHandTable(roundHistory) {
  const tableBody = document.querySelector('.hand-by-hand-table tbody');
  if (!tableBody) {
    console.error('Could not find hand-by-hand table body');
    return;
  }
  
  // Update table header with dynamic team names
  const tableHeader = document.querySelector('.hand-by-hand-table thead tr.table-heading');
  if (tableHeader) {
    const scores = window.gameplay.getCurrentGameScores();
    const headerCells = tableHeader.querySelectorAll('th');
    if (headerCells.length >= 3) {
      // Keep "Bid" as first column
      headerCells[1].textContent = scores.team1Name; // Team 1 column
      headerCells[2].textContent = scores.team2Name; // Team 2 column
    }
  }
  
  // Clear existing rows
  tableBody.innerHTML = '';
  
  // Add rows for each round
  roundHistory.forEach(round => {
    const row = document.createElement('tr');
    
    // Bid column
    const bidCell = document.createElement('td');
    bidCell.className = 'bid-tracker';
    
    const bidIcon = document.createElement('img');
    bidIcon.src = round.bidMade ? 'images/check.png' : 'images/x-fail.png';
    bidIcon.alt = round.bidMade ? 'Success' : 'Fail';
    
    // Format bid text: first 3 letters of bidder name + bid amount
    const bidderShortName = round.bidWinner.substring(0, 3);
    const bidText = document.createTextNode(` ${bidderShortName} ${round.bidAmount}`);
    bidCell.appendChild(bidIcon);
    bidCell.appendChild(bidText);
    
    // Team 1 score column
    const team1Cell = document.createElement('td');
    team1Cell.className = 'bigger';
    team1Cell.textContent = round.team1Final;
    
    // Team 2 score column
    const team2Cell = document.createElement('td');
    team2Cell.className = 'bigger';
    team2Cell.textContent = round.team2Final;
    
    // Add cells to row
    row.appendChild(bidCell);
    row.appendChild(team1Cell);
    row.appendChild(team2Cell);
    
    // Add row to table
    tableBody.appendChild(row);
  });
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
    trickHistory: [],
    // Score tracking - reset to 0 for new round
    team1Score: 0,
    team2Score: 0,
    trickPoints: { team1: [], team2: [] },
    pointCardsWon: { player1: [], player2: [], player3: [], player4: [] }
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
  
  // Update score display to show 0 for new round
  updateScoreDisplay();
  
  // Clear the play area from the previous round
  if (window.gameplay && window.gameplay.clearPlayArea) {
    window.gameplay.clearPlayArea();
  }
  
  // Hide any "See Results" button that might be visible from the previous round
  const gameplaySection = document.querySelector('.cols');
  if (gameplaySection) {
    const rightColumn = gameplaySection.querySelector('.right');
    if (rightColumn) {
      rightColumn.innerHTML = ''; // Clear any buttons
    }
  }
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
    cardLayout.classList.remove('empty-state'); // Remove empty state when dealing new cards
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
 * Update the score display in the left column
 */
function updateScoreDisplay() {
  const scoreElements = document.querySelectorAll('.score-hand .score');
  if (scoreElements.length >= 2) {
    scoreElements[0].textContent = gameState.roundState.team1Score;
    scoreElements[1].textContent = gameState.roundState.team2Score;
  }
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
      
      // Use updated player hand if this is the human player (index 3)
      const handToLog = (index === 3 && gameState.playerHand) ? gameState.playerHand : hand;
      
      console.log(`${playerName} (${handToLog.length} cards):`, handToLog.map(card => `${card.suit} ${card.value}`).join(', '));
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
    
    // Add event listeners for bidding form
    const bidForm = document.getElementById('bidForm');
    const passButton = document.getElementById('passButton');
    const bidButton = document.getElementById('bidButton');
    
    if (bidForm) {
      bidForm.addEventListener('submit', handleBidSubmit);
    }
    
    if (passButton) {
      passButton.addEventListener('click', handlePassClick);
    }
    
    // Start with buttons inactive
    if (bidButton) bidButton.classList.add('inactive');
    if (passButton) passButton.classList.add('inactive');
    
    // Kitty button event listeners will be set up when the KITTY phase starts
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
    updateScoreDisplay,
    logRoundInfo,
    logTrickInfo,
    updateTrickLeaderPill,
    populateScoreUpdateData,
    populateHandByHandTable,
    handleRoundScoringNextClick,
    handleScoreUpdateNextClick,
    // Bidding functions
    initializeBiddingPhase,
    processNextBid,
    processAIBid,
    handleBidSubmit,
    handlePassClick,
    showBidError,
    hideBidError,
    // Kitty functions
    handleKittyNextClick,
    animateComputerKitty,
    updateComputerKittyHeader,
    showFirstStep,
    showSecondStep,
    showPowerSuit,
    showComputerKittyButton,
    initializeHumanKitty,
    populateKittyDisplay,
    setupCardSelection,
    toggleCardSelection,
    getSelectedCards,
    addCardToSelection,
    removeCardFromSelection,
          setupPowerSuitSelection,
      updateHumanKittyChecklist,
      updatePlayerHandDisplay, // Added updatePlayerHandDisplay to the export
      cleanupKittyPhase, // Added cleanupKittyPhase to the export
    GAME_PHASES
  };