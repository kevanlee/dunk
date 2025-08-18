/**
 * Gameplay Logic and UI Management
 * Handles trick-taking mechanics, player interactions, and gameplay UI updates
 */

console.log('gameplay.js is loading...');

/**
 * Get the next player in clockwise order
 * @param {string} currentPlayer - Current player name
 * @returns {string} Next player name
 */
function getNextPlayer(currentPlayer) {
  const playerOrder = [
    window.gameSetup.PLAYERS.PLAYER0.name,
    window.gameSetup.PLAYERS.PLAYER1.name,
    window.gameSetup.PLAYERS.PLAYER2.name,
    window.gameSetup.PLAYERS.PLAYER3.name
  ];
  const currentIndex = playerOrder.indexOf(currentPlayer);
  const nextIndex = (currentIndex + 1) % 4;
  return playerOrder[nextIndex];
}

/**
 * Determine who wins the current trick
 * @param {Array} playedCards - Array of cards played in current trick
 * @param {string} powerSuit - Current power suit
 * @param {string} ledSuit - Suit that was led
 * @returns {string} Name of the winning player
 */
function determineTrickWinner(playedCards, powerSuit, ledSuit) {
  let winningCard = null;
  let winningPlayer = null;
  
  playedCards.forEach((cardData, index) => {
    const card = cardData.card;
    const player = cardData.player;
    
    // Check if this card can win
    if (!winningCard) {
      winningCard = card;
      winningPlayer = player;
      return;
    }
    
    // If current winning card is power suit
    if (winningCard.suit === powerSuit) {
      // Only power suit cards can beat it
      if (card.suit === powerSuit) {
        if (card.value === 1 && winningCard.value !== 1) {
          winningCard = card;
          winningPlayer = player;
        } else if (card.value !== 1 && winningCard.value !== 1 && card.value > winningCard.value) {
          winningCard = card;
          winningPlayer = player;
        }
      }
    } else {
      // Current winning card is not power suit
      if (card.suit === powerSuit) {
        // Power suit beats non-power suit
        winningCard = card;
        winningPlayer = player;
      } else if (card.suit === ledSuit && winningCard.suit === ledSuit) {
        // Both cards follow led suit, compare values
        if (card.value === 1 && winningCard.value !== 1) {
          winningCard = card;
          winningPlayer = player;
        } else if (card.value !== 1 && winningCard.value !== 1 && card.value > winningCard.value) {
          winningCard = card;
          winningPlayer = player;
        }
      }
    }
  });
  
  return winningPlayer;
}

/**
 * Update the trick leader for the next trick
 * @param {string} trickWinner - Player who won the current trick
 */
function updateTrickLeader(trickWinner) {
  if (window.gameState && window.gameState.getGameState) {
    const gameState = window.gameState.getGameState();
    gameState.roundState.trickLeader = trickWinner;
    gameState.roundState.currentTrick++;
  }
}

/**
 * Update all player names in the UI to use actual player names from setup
 */
function updatePlayerNamesInUI() {
  if (!window.gameSetup) {
    console.error('gameSetup not available for updating player names');
    return;
  }
  
  const players = window.gameSetup.PLAYERS;
  const teams = window.gameSetup.TEAMS;
  
  // Update jumbotron team names
  const jumbotronTeams = document.querySelectorAll('.jumbotron-team .scoreboard-team p');
  if (jumbotronTeams.length >= 2) {
    jumbotronTeams[0].textContent = `${teams.TEAM1.players[0].name} + ${teams.TEAM1.players[1].name}`;
    jumbotronTeams[1].textContent = `${teams.TEAM2.players[0].name} + ${teams.TEAM2.players[1].name}`;
  }
  
  // Update left column score team names
  const scoreTeams = document.querySelectorAll('.score-hand .team-name');
  if (scoreTeams.length >= 2) {
    scoreTeams[0].textContent = `${teams.TEAM1.players[0].name} + ${teams.TEAM1.players[1].name}`;
    scoreTeams[1].textContent = `${teams.TEAM2.players[0].name} + ${teams.TEAM2.players[1].name}`;
  }
  
  // Update play area player names (4 slots)
  const playAreaPlayers = document.querySelectorAll('.play-area .player-name');
  if (playAreaPlayers.length >= 4) {
    playAreaPlayers[0].textContent = players.PLAYER0.name; // Patricia (position 0)
    playAreaPlayers[1].textContent = players.PLAYER1.name; // Alex (position 1)
    playAreaPlayers[2].textContent = players.PLAYER2.name; // Jordan (position 2)
    playAreaPlayers[3].textContent = players.PLAYER3.name; // You (position 3)
  }
  
  console.log('Updated player names in UI');
}

/**
 * Initialize card playing functionality
 * Sets up click event listeners for cards in the player's hand
 */
function initializeCardPlaying() {
  console.log('Initializing card playing functionality...');
  
  // Get the current game state to access the sorted hand
  const gameState = window.gameState.getGameState();
  const playerHand = gameState.playerHand;
  
  if (!playerHand) {
    console.error('No player hand available for card playing initialization');
    return;
  }
  
  console.log('Player hand:', playerHand);
  
  // Sort the hand the same way it's displayed in the UI
  const sortedHand = window.cardLogic.sortHand(playerHand);
  console.log('Sorted hand:', sortedHand);
  
  // Find the player's hand cards (only in the visible hand)
  const playerCards = document.querySelectorAll('.your-hand:not(.hidden) .card-layout .card');
  console.log('Found player cards:', playerCards);
  console.log('Number of player cards found:', playerCards.length);
  
  playerCards.forEach((cardElement, displayIndex) => {
    console.log(`Adding click listener to card ${displayIndex}:`, cardElement);
    cardElement.addEventListener('click', () => {
      console.log(`Click event triggered for card ${displayIndex}`);
      // Use the sorted hand index to get the correct card data
      handleCardClick(cardElement, displayIndex, sortedHand);
    });
  });
  
  console.log(`Added click listeners to ${playerCards.length} cards (using sorted order)`);
  
  // Update card availability based on current game state
  updateCardAvailability(sortedHand, gameState);
}

/**
 * Validate if a card can be played according to game rules
 * @param {Object} cardData - The card to validate
 * @param {Object} gameState - Current game state
 * @returns {boolean} True if the card can be played
 */
function isCardPlayValid(cardData, gameState) {
  const playedCards = gameState.roundState.playedCards;
  
  // If leading the trick, any card is valid
  if (playedCards.length === 0) {
    return true;
  }
  
  // Not leading - must follow suit if possible
  const ledSuit = playedCards[0].card.suit;
  const playerHand = gameState.playerHand;
  
  // Check if player has cards of the led suit
  const cardsOfLedSuit = playerHand.filter(card => card.suit === ledSuit);
  
  if (cardsOfLedSuit.length > 0) {
    // Must follow suit
    return cardData.suit === ledSuit;
  } else {
    // Can't follow suit - any card is valid
    return true;
  }
}

/**
 * Update card availability (active/inactive) based on game rules
 * @param {Array} sortedHand - The sorted player hand
 * @param {Object} gameState - Current game state
 */
function updateCardAvailability(sortedHand, gameState) {
  const playedCards = gameState.roundState.playedCards;
  const playerHand = gameState.playerHand;
  
  // Find the player's hand cards (only in the visible hand)
  const playerCards = document.querySelectorAll('.your-hand:not(.hidden) .card-layout .card');
  
  playerCards.forEach((cardElement, displayIndex) => {
    const cardData = sortedHand[displayIndex];
    
    if (!cardData) return;
    
    // Check if this card is valid to play
    const isValid = isCardPlayValid(cardData, gameState);
    
    if (isValid) {
      cardElement.classList.remove('inactive');
    } else {
      cardElement.classList.add('inactive');
    }
  });
  
  console.log('Updated card availability based on suit following rules');
}

/**
 * Handle card click - play the card to the play area
 * @param {HTMLElement} cardElement - The clicked card element
 * @param {number} displayIndex - Index of the card in the displayed (sorted) hand
 * @param {Array} sortedHand - The sorted hand array
 */
function handleCardClick(cardElement, displayIndex, sortedHand) {
  console.log(`Card clicked: display index ${displayIndex}`);
  console.log('Card element:', cardElement);
  console.log('Sorted hand length:', sortedHand ? sortedHand.length : 'undefined');
  
  // Get the current game state
  const gameState = window.gameState.getGameState();
  console.log('Current turn:', gameState.roundState.currentTurn);
  
  // Check if it's the player's turn
  if (gameState.roundState.currentTurn !== "You") {
    console.log(`Not your turn. Current turn: ${gameState.roundState.currentTurn}`);
    return;
  }
  
  // Get the card data from the sorted hand
  if (!sortedHand || displayIndex >= sortedHand.length) {
    console.error('Invalid card index or no sorted hand available');
    return;
  }
  
  const cardData = sortedHand[displayIndex];
  console.log(`Card clicked: display index ${displayIndex} - ${cardData.suit} ${cardData.value} (${cardData.points} points)`);
  
  // Validate the card play
  if (!isCardPlayValid(cardData, gameState)) {
    console.log('Invalid card play - must follow suit if possible');
    return;
  }
  
  console.log('Playing card:', cardData);
  
  // Play the card to the play area
  playCardToPlayArea(cardData, displayIndex);
  
  // Remove the card from the player's hand
  removeCardFromHand(displayIndex);
  
  // Update the game state
  updateGameStateAfterCardPlay(cardData);
  
  // Update card availability only if this was the first card led
  const updatedGameState = window.gameState.getGameState();
  if (updatedGameState.roundState.playedCards.length === 1) {
    const updatedSortedHand = window.cardLogic.sortHand(updatedGameState.playerHand);
    updateCardAvailability(updatedSortedHand, updatedGameState);
  }
}

/**
 * Play a card to the play area
 * @param {Object} cardData - The card data object
 * @param {number} cardIndex - Index of the card in the player's hand
 */
function playCardToPlayArea(cardData, cardIndex) {
  console.log('Attempting to play card to play area...');
  
  // Find the player's position in the play area (You are position 3)
  const playArea = document.querySelector('.play-area');
  console.log('Play area found:', playArea);
  
  if (!playArea) {
    console.error('Could not find play area');
    return;
  }
  
  const playerPosition = 3; // You are PLAYER3
  const playedCardElement = playArea.children[playerPosition];
  console.log('Played card element found:', playedCardElement);
  
  if (!playedCardElement) {
    console.error('Could not find player position in play area');
    return;
  }
  
  // Find the card container in the played card element
  const cardContainer = playedCardElement.querySelector('.card');
  console.log('Card container found:', cardContainer);
  
  if (!cardContainer) {
    console.error('Could not find card container in play area');
    return;
  }
  
  // Update the card display
  cardContainer.className = `card ${cardData.suit}`;
  cardContainer.innerHTML = `<p>${cardData.value} <span class="card-icon"></span></p>`;
  
  console.log(`Card played to position ${playerPosition}: ${cardData.suit} ${cardData.value}`);
}

/**
 * Remove a card from the player's hand
 * @param {number} cardIndex - Index of the card to remove
 */
function removeCardFromHand(cardIndex) {
  const cardLayout = document.querySelector('.your-hand .card-layout');
  const cards = cardLayout.querySelectorAll('.card');
  
  if (cardIndex < cards.length) {
    cards[cardIndex].remove();
    console.log(`Removed card at index ${cardIndex} from hand`);
  }
}

/**
 * Update game state after a card is played
 * @param {Object} cardData - The card that was played
 */
function updateGameStateAfterCardPlay(cardData) {
  const gameState = window.gameState.getGameState();
  
  // Add the card to the played cards array
  gameState.roundState.playedCards.push({
    card: cardData,
    player: 'You'
  });
  
  console.log('Updated game state - card added to played cards');
  console.log('Current played cards:', gameState.roundState.playedCards);
  
  // Advance to next turn
  advanceToNextTurn();
  
  // Check if trick is complete (4 cards played)
  if (gameState.roundState.playedCards.length === 4) {
    completeTrick();
  } else {
    // Start AI turn if next player is AI
    if (gameState.roundState.currentTurn !== "You") {
      startAITurn();
    }
  }
}

/**
 * Advance to the next player's turn
 */
function advanceToNextTurn() {
  const gameState = window.gameState.getGameState();
  const turnOrder = gameState.roundState.turnOrder;
  const currentTurnIndex = turnOrder.indexOf(gameState.roundState.currentTurn);
  const nextTurnIndex = (currentTurnIndex + 1) % 4;
  const nextTurn = turnOrder[nextTurnIndex];
  
  gameState.roundState.currentTurn = nextTurn;
  console.log(`Turn advanced: ${gameState.roundState.currentTurn} → ${nextTurn}`);
}

/**
 * Complete the current trick and determine winner
 */
function completeTrick() {
  const gameState = window.gameState.getGameState();
  const playedCards = gameState.roundState.playedCards;
  const powerSuit = gameState.roundState.powerSuit;
  
  // Determine the led suit (first card played)
  const ledSuit = playedCards[0].card.suit;
  
  // Determine trick winner
  const trickWinner = determineTrickWinner(playedCards, powerSuit, ledSuit);
  
  console.log(`Trick complete! Winner: ${trickWinner}`);
  console.log('Played cards:', playedCards);
  
  // Mark the winning card in the UI
  markWinningCard(trickWinner);
  
  // Show Next button for next trick
  showNextTrickButton();
}

/**
 * Mark the winning card in the UI
 * @param {string} trickWinner - Name of the winning player
 */
function markWinningCard(trickWinner) {
  const playArea = document.querySelector('.play-area');
  const playedCards = playArea.querySelectorAll('.played-card');
  
  // Remove winner class from all cards
  playedCards.forEach(card => card.classList.remove('winner'));
  
  // Find the winning player's position and add winner class
  const players = window.gameSetup.PLAYERS;
  let winnerPosition = -1;
  
  if (trickWinner === players.PLAYER0.name) winnerPosition = 0;
  else if (trickWinner === players.PLAYER1.name) winnerPosition = 1;
  else if (trickWinner === players.PLAYER2.name) winnerPosition = 2;
  else if (trickWinner === players.PLAYER3.name) winnerPosition = 3;
  
  if (winnerPosition >= 0 && playedCards[winnerPosition]) {
    playedCards[winnerPosition].classList.add('winner');
    console.log(`Marked ${trickWinner}'s card as winner at position ${winnerPosition}`);
  }
}

/**
 * Show the Next button for proceeding to next trick
 */
function showNextTrickButton() {
  const rightColumn = document.querySelector('.cols .right');
  if (rightColumn) {
    rightColumn.innerHTML = '<button onclick="window.gameplay.proceedToNextTrick()">Next ⮑</button>';
    console.log('Next trick button shown');
  }
}

/**
 * Start AI turn - simple random card selection
 */
function startAITurn() {
  const gameState = window.gameState.getGameState();
  const currentTurn = gameState.roundState.currentTurn;
  
  console.log(`Starting AI turn for ${currentTurn}`);
  
  // Simple AI: play a random card from the AI's hand
  setTimeout(() => {
    playAICard(currentTurn);
  }, 500); // Small delay to make it feel more natural
}

/**
 * Play a card for the AI player
 * @param {string} aiPlayer - Name of the AI player
 */
function playAICard(aiPlayer) {
  const gameState = window.gameState.getGameState();
  
  // Get the AI's hand based on player name
  let aiHandIndex = -1;
  const players = window.gameSetup.PLAYERS;
  
  if (aiPlayer === players.PLAYER0.name) aiHandIndex = 0; // Patricia
  else if (aiPlayer === players.PLAYER1.name) aiHandIndex = 1; // Alex
  else if (aiPlayer === players.PLAYER2.name) aiHandIndex = 2; // Jordan
  
  if (aiHandIndex === -1) {
    console.error(`Unknown AI player: ${aiPlayer}`);
    return;
  }
  
  const aiHand = gameState.hands[aiHandIndex];
  if (!aiHand || aiHand.length === 0) {
    console.error(`No cards in ${aiPlayer}'s hand`);
    return;
  }
  
  // Use AI module to select a card
  const playedCards = gameState.roundState.playedCards;
  const powerSuit = gameState.roundState.powerSuit;
  const cardData = window.ai.selectAICard(aiPlayer, aiHand, playedCards, powerSuit);
  
  if (!cardData) {
    console.error(`${aiPlayer} could not select a valid card`);
    return;
  }
  
  // Get the index of the selected card in the original hand
  const cardIndex = window.ai.getCardIndexInHand(aiHand, cardData);
  
  // Play the card to the play area
  playAICardToPlayArea(cardData, aiPlayer);
  
  // Remove the card from AI's hand
  removeCardFromAIHand(aiHandIndex, cardIndex);
  
  // Update game state
  updateGameStateAfterAICardPlay(cardData, aiPlayer);
  
  // Update card availability for human player only if this was the first card led
  const updatedGameState = window.gameState.getGameState();
  if (updatedGameState.roundState.currentTurn === "You" && updatedGameState.roundState.playedCards.length === 1) {
    const updatedSortedHand = window.cardLogic.sortHand(updatedGameState.playerHand);
    updateCardAvailability(updatedSortedHand, updatedGameState);
  }
}

/**
 * Play an AI card to the play area
 * @param {Object} cardData - The card data object
 * @param {string} aiPlayer - Name of the AI player
 */
function playAICardToPlayArea(cardData, aiPlayer) {
  const playArea = document.querySelector('.play-area');
  const players = window.gameSetup.PLAYERS;
  
  // Find the AI's position in the play area
  let playerPosition = -1;
  if (aiPlayer === players.PLAYER0.name) playerPosition = 0; // Patricia
  else if (aiPlayer === players.PLAYER1.name) playerPosition = 1; // Alex
  else if (aiPlayer === players.PLAYER2.name) playerPosition = 2; // Jordan
  
  if (playerPosition === -1) {
    console.error(`Could not find position for AI player: ${aiPlayer}`);
    return;
  }
  
  const playedCardElement = playArea.children[playerPosition];
  if (!playedCardElement) {
    console.error(`Could not find player position ${playerPosition} in play area`);
    return;
  }
  
  // Find the card container in the played card element
  const cardContainer = playedCardElement.querySelector('.card');
  if (!cardContainer) {
    console.error('Could not find card container in play area');
    return;
  }
  
  // Update the card display
  cardContainer.className = `card ${cardData.suit}`;
  cardContainer.innerHTML = `<p>${cardData.value} <span class="card-icon"></span></p>`;
  
  console.log(`AI card played to position ${playerPosition}: ${cardData.suit} ${cardData.value}`);
}

/**
 * Remove a card from the AI's hand
 * @param {number} aiHandIndex - Index of the AI's hand
 * @param {number} cardIndex - Index of the card to remove
 */
function removeCardFromAIHand(aiHandIndex, cardIndex) {
  const gameState = window.gameState.getGameState();
  const aiHand = gameState.hands[aiHandIndex];
  
  if (aiHand && cardIndex < aiHand.length) {
    aiHand.splice(cardIndex, 1);
    console.log(`Removed card at index ${cardIndex} from AI hand ${aiHandIndex}`);
  }
}

/**
 * Update game state after an AI card is played
 * @param {Object} cardData - The card that was played
 * @param {string} aiPlayer - Name of the AI player
 */
function updateGameStateAfterAICardPlay(cardData, aiPlayer) {
  const gameState = window.gameState.getGameState();
  
  // Add the card to the played cards array
  gameState.roundState.playedCards.push({
    card: cardData,
    player: aiPlayer
  });
  
  console.log(`Updated game state - ${aiPlayer}'s card added to played cards`);
  console.log('Current played cards:', gameState.roundState.playedCards);
  
  // Advance to next turn
  advanceToNextTurn();
  
  // Check if trick is complete (4 cards played)
  if (gameState.roundState.playedCards.length === 4) {
    completeTrick();
  } else {
    // Start next AI turn if next player is AI
    if (gameState.roundState.currentTurn !== "You") {
      startAITurn();
    }
  }
}

/**
 * Proceed to the next trick
 */
function proceedToNextTrick() {
  const gameState = window.gameState.getGameState();
  
  // Get the trick winner to be the new trick leader
  const playedCards = gameState.roundState.playedCards;
  const powerSuit = gameState.roundState.powerSuit;
  const ledSuit = playedCards[0].card.suit;
  const trickWinner = determineTrickWinner(playedCards, powerSuit, ledSuit);
  
  // Update trick leader and current turn
  gameState.roundState.trickLeader = trickWinner;
  gameState.roundState.currentTurn = trickWinner;
  
  // Increment trick counter
  gameState.roundState.currentTrick++;
  
  // Clear played cards for new trick
  gameState.roundState.playedCards = [];
  
  // Clear play area
  clearPlayArea();
  
  // Update "First" pill for new trick leader
  updateTrickLeaderPill();
  
  // Hide Next button
  const rightColumn = document.querySelector('.cols .right');
  if (rightColumn) {
    rightColumn.innerHTML = '';
  }
  
  console.log(`Proceeding to trick ${gameState.roundState.currentTrick + 1}/13`);
  console.log(`New trick leader: ${trickWinner}`);
  
  // Log new trick info
  if (window.gameState && window.gameState.logTrickInfo) {
    window.gameState.logTrickInfo();
  }
  
  // Start AI turn if trick leader is AI
  if (gameState.roundState.currentTurn !== "You") {
    startAITurn();
  }
}

/**
 * Clear the play area for the next trick
 */
function clearPlayArea() {
  const playArea = document.querySelector('.play-area');
  const playedCards = playArea.querySelectorAll('.played-card');
  
  playedCards.forEach(cardElement => {
    const cardContainer = cardElement.querySelector('.card');
    if (cardContainer) {
      cardContainer.className = 'card empty';
      cardContainer.innerHTML = '';
    }
    // Remove winner class
    cardElement.classList.remove('winner');
  });
  
  console.log('Play area cleared for next trick');
}

// Export functions for use in other modules
window.gameplay = {
  getNextPlayer,
  determineTrickWinner,
  updateTrickLeader,
  updatePlayerNamesInUI,
  initializeCardPlaying,
  handleCardClick,
  playCardToPlayArea,
  removeCardFromHand,
  updateGameStateAfterCardPlay,
  isCardPlayValid,
  updateCardAvailability,
  advanceToNextTurn,
  completeTrick,
  markWinningCard,
  showNextTrickButton,
  startAITurn,
  playAICard,
  playAICardToPlayArea,
  removeCardFromAIHand,
  updateGameStateAfterAICardPlay,
  proceedToNextTrick,
  clearPlayArea
};

console.log('gameplay exported:', Object.keys(window.gameplay));
