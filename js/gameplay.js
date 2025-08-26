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
    
    // Handle Dunk card - it automatically becomes the power suit
    let effectiveSuit = card.suit;
    let effectiveValue = card.value;
    
    if (card.suit === 'dunk') {
      effectiveSuit = powerSuit;
      effectiveValue = 10.5; // Dunk card is worth 10.5 in the power suit
    }
    
    // Check if this card can win
    if (!winningCard) {
      winningCard = { ...card, effectiveSuit, effectiveValue };
      winningPlayer = player;
      return;
    }
    
    // If current winning card is power suit
    if (winningCard.effectiveSuit === powerSuit) {
      // Only power suit cards can beat it
      if (effectiveSuit === powerSuit) {
        if (effectiveValue === 1 && winningCard.effectiveValue !== 1) {
          winningCard = { ...card, effectiveSuit, effectiveValue };
          winningPlayer = player;
        } else if (effectiveValue !== 1 && winningCard.effectiveValue !== 1 && effectiveValue > winningCard.effectiveValue) {
          winningCard = { ...card, effectiveSuit, effectiveValue };
          winningPlayer = player;
        }
      }
    } else {
      // Current winning card is not power suit
      if (effectiveSuit === powerSuit) {
        // Power suit beats non-power suit
        winningCard = { ...card, effectiveSuit, effectiveValue };
        winningPlayer = player;
      } else if (effectiveSuit === ledSuit && winningCard.effectiveSuit === ledSuit) {
        // Both cards follow led suit, compare values
        if (effectiveValue === 1 && winningCard.effectiveValue !== 1) {
          winningCard = { ...card, effectiveSuit, effectiveValue };
          winningPlayer = player;
        } else if (effectiveValue !== 1 && winningCard.effectiveValue !== 1 && effectiveValue > winningCard.effectiveValue) {
          winningCard = { ...card, effectiveSuit, effectiveValue };
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
    cardElement.addEventListener('click', () => {
      // Use the sorted hand index to get the correct card data
      handleCardClick(cardElement, displayIndex, sortedHand);
    });
  });
  
  // Update card availability based on current game state
  updateCardAvailability(sortedHand, gameState);
  
  // Check if it's an AI's turn to start
  if (gameState.roundState.currentTurn !== "You") {
    console.log(`Starting AI turn for: ${gameState.roundState.currentTurn}`);
    startAITurn();
  }
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
  let ledSuit = playedCards[0].card.suit;
  const playerHand = gameState.playerHand;
  const powerSuit = gameState.roundState.powerSuit;
  
  // If Dunk card is led, it declares the power suit
  if (ledSuit === 'dunk') {
    ledSuit = powerSuit;
  }
  
  // Check if player has cards of the led suit (including Dunk card if it matches the power suit)
  const cardsOfLedSuit = playerHand.filter(card => {
    if (card.suit === ledSuit) return true;
    if (card.suit === 'dunk' && powerSuit === ledSuit) return true;
    return false;
  });
  
  if (cardsOfLedSuit.length > 0) {
    // Must follow suit (Dunk card only valid if power suit matches led suit)
    return cardData.suit === ledSuit || (cardData.suit === 'dunk' && powerSuit === ledSuit);
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
}

/**
 * Handle card click - play the card to the play area
 * @param {HTMLElement} cardElement - The clicked card element
 * @param {number} displayIndex - Index of the card in the displayed (sorted) hand
 * @param {Array} sortedHand - The sorted hand array
 */
function handleCardClick(cardElement, displayIndex, sortedHand) {
  // Get the current game state
  const gameState = window.gameState.getGameState();
  
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
  console.log(`Playing: ${cardData.suit} ${cardData.value}`);
  
  // Validate the card play
  if (!isCardPlayValid(cardData, gameState)) {
    console.log('Invalid card play - must follow suit if possible');
    return;
  }
  
  // Play the card to the play area
  playCardToPlayArea(cardData, displayIndex);
  
  // Remove the card from the player's hand (pass the card element for DOM removal)
  removeCardFromHand(displayIndex, cardElement, cardData);
  
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
  // Find the player's position in the play area (You are position 3)
  const playArea = document.querySelector('.play-area');
  
  if (!playArea) {
    console.error('Could not find play area');
    return;
  }
  
  const playerPosition = 3; // You are PLAYER3
  const playedCardElement = playArea.children[playerPosition];
  
  if (!playedCardElement) {
    console.error('Could not find player position in play area');
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
}

/**
 * Remove a card from the player's hand
 * @param {number} cardIndex - Index of the card to remove
 * @param {HTMLElement} cardElement - The card element to remove from DOM
 * @param {Object} cardData - The actual card data that was played
 */
function removeCardFromHand(cardIndex, cardElement, cardData) {
  // Remove from DOM using the specific card element
  if (cardElement && cardElement.parentNode) {
    cardElement.remove();
  }
  
  // Check if this was the last card and show empty state
  const cardLayout = document.querySelector('.your-hand .card-layout');
  const remainingCards = cardLayout.querySelectorAll('.card');
  if (remainingCards.length === 0) {
    cardLayout.classList.add('empty-state');
  }
  
  // Remove from game state using the actual card data that was played
  const gameState = window.gameState.getGameState();
  
  // Find the exact card in the original hand and remove it
  const originalIndex = gameState.playerHand.findIndex(card => 
    card.suit === cardData.suit && card.value === cardData.value
  );
  
  if (originalIndex !== -1) {
    gameState.playerHand.splice(originalIndex, 1);
    console.log(`Removed ${cardData.suit} ${cardData.value} from hand. Cards remaining: ${gameState.playerHand.length}`);
  } else {
    console.error(`Could not find card ${cardData.suit} ${cardData.value} in hand to remove`);
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
  
  // Log hand sizes for debugging
  logHandSizes();
  
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
 * Log the current hand sizes for debugging
 */
function logHandSizes() {
  // Removed hand size logging to clean up console output
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
}

/**
 * Complete the current trick and determine winner
 */
function completeTrick() {
  const gameState = window.gameState.getGameState();
  const playedCards = gameState.roundState.playedCards;
  const powerSuit = gameState.roundState.powerSuit;
  
  // Determine the led suit (first card played)
  let ledSuit = playedCards[0].card.suit;
  
  // If Dunk card is led, it declares the power suit
  if (ledSuit === 'dunk') {
    ledSuit = powerSuit;
  }
  
  // Determine trick winner
  const trickWinner = determineTrickWinner(playedCards, powerSuit, ledSuit);
  
  console.log(`Trick complete! Winner: ${trickWinner}`);
  
  // Track point cards won in this trick
  trackTrickPoints(playedCards, trickWinner);
  
  // Add a small delay before marking the winner
  setTimeout(() => {
    // Mark the winning card in the UI
    markWinningCard(trickWinner);
    
    // Show Next button for next trick
    showNextTrickButton();
  }, 1000); // 1 second delay
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
  }
}

/**
 * Show the Next button for proceeding to next trick
 */
function showNextTrickButton() {
  const rightColumn = document.querySelector('.cols .right');
  if (rightColumn) {
    rightColumn.innerHTML = '<button onclick="window.gameplay.proceedToNextTrick()">Next ⮑</button>';
  }
}

/**
 * Handle final trick rewards: kitty points + 20-point bonus
 * @param {string} finalTrickWinner - Player who won the final trick
 */
function handleFinalTrickRewards(finalTrickWinner) {
  const gameState = window.gameState.getGameState();
  const players = window.gameSetup.PLAYERS;
  
  // Determine which team won the final trick
  let winningTeam = null;
  let playerIndex = -1;
  
  if (finalTrickWinner === players.PLAYER0.name) {
    winningTeam = 'team2';
    playerIndex = 0;
  } else if (finalTrickWinner === players.PLAYER1.name) {
    winningTeam = 'team1';
    playerIndex = 1;
  } else if (finalTrickWinner === players.PLAYER2.name) {
    winningTeam = 'team2';
    playerIndex = 2;
  } else if (finalTrickWinner === players.PLAYER3.name) {
    winningTeam = 'team1';
    playerIndex = 3;
  }
  
  if (!winningTeam) {
    console.error(`Unknown player: ${finalTrickWinner}`);
    return;
  }
  
  // Log kitty contents before calculating points
  console.log('=== KITTY BEFORE FINAL TRICK SCORING ===');
  if (gameState.kitty && gameState.kitty.length > 0) {
    console.log(`Kitty has ${gameState.kitty.length} cards:`);
    gameState.kitty.forEach((card, index) => {
      console.log(`  ${index + 1}. ${card.suit} ${card.value} (${card.points} points)`);
    });
    const totalKittyPoints = gameState.kitty.reduce((sum, card) => sum + (card.points || 0), 0);
    console.log(`Total kitty points: ${totalKittyPoints}`);
  } else {
    console.log('Kitty is empty or null');
  }
  console.log('========================================');
  
  // Calculate kitty points
  let kittyPoints = 0;
  const kittyCards = [];
  if (gameState.kitty && gameState.kitty.length > 0) {
    gameState.kitty.forEach(card => {
      if (card.points > 0) {
        kittyPoints += card.points;
        kittyCards.push({
          suit: card.suit,
          value: card.value,
          points: card.points,
          wonBy: finalTrickWinner,
          source: 'kitty'
        });
      }
    });
  }
  
  // Add 20-point bonus for winning final trick
  const finalTrickBonus = 20;
  
  // Update team score with kitty points + final trick bonus
  const totalBonusPoints = kittyPoints + finalTrickBonus;
  
  if (winningTeam === 'team1') {
    gameState.roundState.team1Score += totalBonusPoints;
    gameState.roundState.trickPoints.team1.push(...kittyCards);
  } else {
    gameState.roundState.team2Score += totalBonusPoints;
    gameState.roundState.trickPoints.team2.push(...kittyCards);
  }
  
  // Update individual player point cards
  if (playerIndex >= 0) {
    const playerKey = `player${playerIndex + 1}`;
    gameState.roundState.pointCardsWon[playerKey].push(...kittyCards);
  }
  
  console.log(`${finalTrickWinner} won the final trick and gets:`);
  console.log(`- Kitty points: ${kittyPoints}`);
  console.log(`- Final trick bonus: ${finalTrickBonus}`);
  console.log(`- Total bonus: ${totalBonusPoints}`);
  
  // Clear the kitty since points have been awarded
  gameState.kitty = [];
  
  // Verify total points = 200
  const totalPoints = gameState.roundState.team1Score + gameState.roundState.team2Score;
  console.log(`Total points in round: ${totalPoints} (should be 200)`);
}

/**
 * Show the final round button for transitioning to round scoring
 */
function showFinalRoundButton() {
  const rightColumn = document.querySelector('.cols .right');
  if (rightColumn) {
    rightColumn.innerHTML = '<button onclick="window.gameplay.transitionToRoundScoring()">See Results →</button>';
  }
}

/**
 * Start AI turn - simple random card selection
 */
function startAITurn() {
  const gameState = window.gameState.getGameState();
  const currentTurn = gameState.roundState.currentTurn;
  
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
  
  // Determine AI seat and current winner for strategic play
  const aiSeat = getPlayerSeat(aiPlayer);
  const currentWinner = getCurrentTrickWinner(playedCards, powerSuit);
  const currentWinnerSeat = currentWinner ? getPlayerSeat(currentWinner.player) : null;
  
  const cardData = window.ai.selectAICard(aiPlayer, aiHand, playedCards, powerSuit, aiSeat, currentWinnerSeat);
  
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
  
  console.log(`${aiPlayer} plays: ${cardData.suit} ${cardData.value}`);
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
  
  // Log hand sizes for debugging
  logHandSizes();
  
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
  let ledSuit = playedCards[0].card.suit;
  
  // If Dunk card is led, it declares the power suit
  if (ledSuit === 'dunk') {
    ledSuit = powerSuit;
  }
  
  const trickWinner = determineTrickWinner(playedCards, powerSuit, ledSuit);
  
  // Store the trick winner in the trickWinners array
  gameState.roundState.trickWinners.push(trickWinner);
  
  // Check if this was the last trick (13/13)
  if (gameState.roundState.currentTrick === 12) { // 0-indexed, so trick 13 is at index 12
    // Handle final trick special rules: kitty points + 20-point bonus
    handleFinalTrickRewards(trickWinner);
    
    logRoundEndSummary(trickWinner);
    
    // Show final round button instead of proceeding to next trick
    showFinalRoundButton();
    return; // Don't proceed to next trick
  }
  
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
  
  // Reset card availability for new trick (since no cards have been played yet)
  const updatedGameState = window.gameState.getGameState();
  const updatedSortedHand = window.cardLogic.sortHand(updatedGameState.playerHand);
  updateCardAvailability(updatedSortedHand, updatedGameState);
  
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
 * Log round end summary with team scores and point cards
 * @param {string} lastTrickWinner - Player who won the final trick (13/13)
 */
function logRoundEndSummary(lastTrickWinner) {
  const gameState = window.gameState.getGameState();
  const players = window.gameSetup.PLAYERS;
  
  // Determine which team won the last trick
  let team1WonLastTrick = false;
  let team2WonLastTrick = false;
  
  if (lastTrickWinner === players.PLAYER1.name || lastTrickWinner === players.PLAYER3.name) {
    team1WonLastTrick = true;
  } else if (lastTrickWinner === players.PLAYER0.name || lastTrickWinner === players.PLAYER2.name) {
    team2WonLastTrick = true;
  }
  
  // Calculate tricks won per team
  let team1Tricks = 0;
  let team2Tricks = 0;
  
  gameState.roundState.trickWinners.forEach(winner => {
    if (winner === players.PLAYER1.name || winner === players.PLAYER3.name) {
      team1Tricks++;
    } else if (winner === players.PLAYER0.name || winner === players.PLAYER2.name) {
      team2Tricks++;
    }
  });
  
  // Calculate kitty points
  let kittyPoints = 0;
  let kittyCards = [];
  if (gameState.kitty && gameState.kitty.length > 0) {
    gameState.kitty.forEach(card => {
      if (card.points > 0) {
        kittyPoints += card.points;
        kittyCards.push(`${card.suit} ${card.value} (${card.points})`);
      }
    });
  }
  
  console.log('=== ROUND END SUMMARY ===');
  console.log(`Team 1 (Alex + You): ${gameState.roundState.team1Score} points`);
  console.log(`Team 1 point cards:`, gameState.roundState.trickPoints.team1.map(card => `${card.suit} ${card.value} (${card.points})`).join(', '));
  console.log(`Team 1 tricks won: ${team1Tricks}/13`);
  console.log(`Team 1 won last trick: ${team1WonLastTrick}`);
  console.log('');
  console.log(`Team 2 (Patricia + Jordan): ${gameState.roundState.team2Score} points`);
  console.log(`Team 2 point cards:`, gameState.roundState.trickPoints.team2.map(card => `${card.suit} ${card.value} (${card.points})`).join(', '));
  console.log(`Team 2 tricks won: ${team2Tricks}/13`);
  console.log(`Team 2 won last trick: ${team2WonLastTrick}`);
  console.log('');
  if (kittyPoints > 0) {
    console.log(`Kitty points: ${kittyPoints} (${kittyCards.join(', ')})`);
  } else {
    console.log(`Kitty points: 0`);
  }
  
  // Verify total points = 200
  const totalPoints = gameState.roundState.team1Score + gameState.roundState.team2Score;
  console.log(`Total points in round: ${totalPoints} (should be 200)`);
  console.log('==========================');
}

/**
 * Track point cards won in a trick and update scores
 * @param {Array} playedCards - Cards played in the trick
 * @param {string} trickWinner - Player who won the trick
 */
function trackTrickPoints(playedCards, trickWinner) {
  const gameState = window.gameState.getGameState();
  const players = window.gameSetup.PLAYERS;
  const teams = window.gameSetup.TEAMS;
  
  // Determine which team the winner belongs to
  let winningTeam = null;
  let playerIndex = -1;
  
  if (trickWinner === players.PLAYER0.name) {
    winningTeam = 'team2';
    playerIndex = 0;
  } else if (trickWinner === players.PLAYER1.name) {
    winningTeam = 'team1';
    playerIndex = 1;
  } else if (trickWinner === players.PLAYER2.name) {
    winningTeam = 'team2';
    playerIndex = 2;
  } else if (trickWinner === players.PLAYER3.name) {
    winningTeam = 'team1';
    playerIndex = 3;
  }
  
  if (!winningTeam) {
    console.error(`Unknown player: ${trickWinner}`);
    return;
  }
  
  // Check each played card for points
  let trickPoints = 0;
  const pointCards = [];
  
  playedCards.forEach(cardData => {
    const card = cardData.card;
    if (card.points > 0) {
      trickPoints += card.points;
      pointCards.push({
        suit: card.suit,
        value: card.value,
        points: card.points,
        wonBy: trickWinner
      });
    }
  });
  
  // Update team score
  if (winningTeam === 'team1') {
    gameState.roundState.team1Score += trickPoints;
    gameState.roundState.trickPoints.team1.push(...pointCards);
  } else {
    gameState.roundState.team2Score += trickPoints;
    gameState.roundState.trickPoints.team2.push(...pointCards);
  }
  
  // Update individual player point cards
  if (playerIndex >= 0) {
    const playerKey = `player${playerIndex + 1}`;
    gameState.roundState.pointCardsWon[playerKey].push(...pointCards);
  }
  
  // Update score display
  if (window.gameState && window.gameState.updateScoreDisplay) {
    window.gameState.updateScoreDisplay();
  }
  
  if (trickPoints > 0) {
    console.log(`${trickWinner} won ${trickPoints} points in this trick`);
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
}

/**
 * Transition from gameplay to round scoring phase
 */
function transitionToRoundScoring() {
  console.log('Transitioning to round scoring phase...');
  
  // Calculate end-of-round scores and update game totals
  calculateEndOfRoundScores();
  
  // Make player's hand inactive
  makePlayerHandInactive();
  
  // Hide gameplay sections
  hideGameplaySections();
  
  // Show round scoring section
  showRoundScoringSection();
  
  // Populate round scoring data
  populateRoundScoringData();
  
  // Change game phase
  if (window.gameState && window.gameState.setCurrentPhase) {
    window.gameState.setCurrentPhase('round_scoring');
  }
}

/**
 * Calculate end-of-round scores according to Kentucky Rook rules
 * - If bidding team makes their bid: they get their earned points
 * - If bidding team fails their bid: they get negative points equal to their bid amount
 * - Non-bidding team always gets their earned points
 */
function calculateEndOfRoundScores() {
  const gameState = window.gameState.getGameState();
  const players = window.gameSetup.PLAYERS;
  
  const bidWinner = gameState.roundState.bidWinner;
  const currentBid = gameState.roundState.currentBid;
  const team1EarnedPoints = gameState.roundState.team1Score;
  const team2EarnedPoints = gameState.roundState.team2Score;
  
  // Determine which team was the bidding team
  let biddingTeam = null;
  let nonBiddingTeam = null;
  let biddingTeamEarnedPoints = 0;
  let nonBiddingTeamEarnedPoints = 0;
  
  if (bidWinner === players.PLAYER1.name || bidWinner === players.PLAYER3.name) {
    // Team 1 (Alex + You) was the bidding team
    biddingTeam = 'team1';
    nonBiddingTeam = 'team2';
    biddingTeamEarnedPoints = team1EarnedPoints;
    nonBiddingTeamEarnedPoints = team2EarnedPoints;
  } else {
    // Team 2 (Patricia + Jordan) was the bidding team
    biddingTeam = 'team2';
    nonBiddingTeam = 'team1';
    biddingTeamEarnedPoints = team2EarnedPoints;
    nonBiddingTeamEarnedPoints = team1EarnedPoints;
  }
  
  // Calculate final round scores according to rules
  let biddingTeamFinalScore = 0;
  let nonBiddingTeamFinalScore = nonBiddingTeamEarnedPoints; // Non-bidding team always gets their earned points
  
  if (biddingTeamEarnedPoints >= currentBid) {
    // Bidding team made their bid - they get their earned points
    biddingTeamFinalScore = biddingTeamEarnedPoints;
    console.log(`${biddingTeam} made their bid of ${currentBid} with ${biddingTeamEarnedPoints} points`);
  } else {
    // Bidding team failed their bid - they get negative points equal to their bid
    biddingTeamFinalScore = -currentBid;
    console.log(`${biddingTeam} failed their bid of ${currentBid} (earned ${biddingTeamEarnedPoints}) - they get -${currentBid} points`);
  }
  
  // Update the round state with final scores
  if (biddingTeam === 'team1') {
    gameState.roundState.team1FinalScore = biddingTeamFinalScore;
    gameState.roundState.team2FinalScore = nonBiddingTeamFinalScore;
  } else {
    gameState.roundState.team1FinalScore = nonBiddingTeamFinalScore;
    gameState.roundState.team2FinalScore = biddingTeamFinalScore;
  }
  
  // Add round scores to game totals
  gameState.scores.team1 += gameState.roundState.team1FinalScore;
  gameState.scores.team2 += gameState.roundState.team2FinalScore;
  
  // Store round in history
  const roundRecord = {
    roundNumber: gameState.currentHand,
    bidWinner: bidWinner,
    bidAmount: currentBid,
    team1Earned: team1EarnedPoints,
    team2Earned: team2EarnedPoints,
    team1Final: gameState.roundState.team1FinalScore,
    team2Final: gameState.roundState.team2FinalScore,
    team1Total: gameState.scores.team1,
    team2Total: gameState.scores.team2,
    bidMade: biddingTeamEarnedPoints >= currentBid
  };
  
  gameState.roundHistory.push(roundRecord);
  
  console.log('=== END OF ROUND SCORING ===');
  console.log(`Round ${gameState.currentHand} Results:`);
  console.log(`Bid: ${bidWinner} bid ${currentBid}`);
  console.log(`Team 1 earned: ${team1EarnedPoints}, final: ${gameState.roundState.team1FinalScore}, total: ${gameState.scores.team1}`);
  console.log(`Team 2 earned: ${team2EarnedPoints}, final: ${gameState.roundState.team2FinalScore}, total: ${gameState.scores.team2}`);
  console.log(`Bid ${roundRecord.bidMade ? 'MADE' : 'FAILED'}`);
  console.log('============================');
}

/**
 * Check if either team has reached 500 points to end the game
 */
function checkForGameEnd() {
  const gameState = window.gameState.getGameState();
  const winningScore = window.gameSetup.GAME_CONSTANTS.WINNING_SCORE;
  
  // Check if we've already processed the end of this game
  if (gameState.currentPhase === 'end') {
    console.log('Game end already processed, skipping...');
    return true;
  }
  
  if (gameState.scores.team1 >= winningScore || gameState.scores.team2 >= winningScore) {
    console.log('=== GAME END DETECTED ===');
    console.log(`Team 1: ${gameState.scores.team1} points`);
    console.log(`Team 2: ${gameState.scores.team2} points`);
    
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
    
    console.log(`Winner: ${winner}`);
    console.log('========================');
    
    // Transition to end game phase
    if (window.gameState && window.gameState.setCurrentPhase) {
      window.gameState.setCurrentPhase('end');
      showEndGameModal(winner);
    }
    
    return true; // Game ended
  }
  
  return false; // Game continues
}

/**
 * Show the appropriate end game modal (win or lose)
 * @param {string} winner - 'team1' or 'team2'
 */
function showEndGameModal(winner) {
  const gameState = window.gameState.getGameState();
  const teams = window.gameSetup.TEAMS;
  
  // Determine if the current player (hand[3]) is on the winning team
  const currentPlayer = teams.TEAM1.players.find(p => p.name === "You") || teams.TEAM2.players.find(p => p.name === "You");
  const playerTeam = currentPlayer ? (currentPlayer.team === 1 ? 'team1' : 'team2') : 'team1'; // Default to team1 if not found
  const playerWon = winner === playerTeam;
  
  // Update player stats with enhanced game data (only if not already updated)
  if (!gameState.statsUpdated) {
    const gameData = {
      finalScore: playerTeam === 'team1' ? gameState.scores.team1 : gameState.scores.team2,
      bidAmount: gameState.roundState.currentBid,
      bidMade: gameState.roundState.team1Score >= gameState.roundState.currentBid || 
               gameState.roundState.team2Score >= gameState.roundState.currentBid,
      maxTrickPoints: calculateMaxTrickPoints()
    };
    updateGameStats(playerWon, gameData);
    
    // Mark stats as updated for this game
    gameState.statsUpdated = true;
  }
  
  // Hide all modal sections first
  const allModalSections = document.querySelectorAll('.modal-row');
  allModalSections.forEach(section => {
    if (!section.querySelector('.bballs')) {
      section.classList.add('hidden');
    }
  });
  
  // Explicitly hide the standalone hand score modal to prevent conflicts
  const standaloneHandScoreModal = document.querySelector('.modal.hand-score').closest('.modal-row');
  if (standaloneHandScoreModal) {
    standaloneHandScoreModal.classList.add('hidden');
  }
  
  // Show the appropriate end game modal
  const endGameModal = document.querySelector(`.end-game.${playerWon ? 'win' : 'lose'}`).closest('.modal-row');
  if (endGameModal) {
    endGameModal.classList.remove('hidden');
  } else {
    console.error('Could not find end game modal');
    return;
  }
  
  // Populate the final scores in the correct order (player's team first)
  const finalScoreElements = endGameModal.querySelectorAll('.end-game-main .scorebox p');
  if (finalScoreElements.length >= 2) {
    if (playerTeam === 'team1') {
      finalScoreElements[0].textContent = gameState.scores.team1;
      finalScoreElements[1].textContent = gameState.scores.team2;
    } else {
      finalScoreElements[0].textContent = gameState.scores.team2;
      finalScoreElements[1].textContent = gameState.scores.team1;
    }
  }
  
  // Populate team names in the correct order (player's team first)
  const teamNameElements = endGameModal.querySelectorAll('.end-game-main .scoreboard-team p');
  if (teamNameElements.length >= 2) {
    if (playerTeam === 'team1') {
      teamNameElements[0].textContent = `${teams.TEAM1.players[0].name} + ${teams.TEAM1.players[1].name}`;
      teamNameElements[1].textContent = `${teams.TEAM2.players[0].name} + ${teams.TEAM2.players[1].name}`;
    } else {
      teamNameElements[0].textContent = `${teams.TEAM2.players[0].name} + ${teams.TEAM2.players[1].name}`;
      teamNameElements[1].textContent = `${teams.TEAM1.players[0].name} + ${teams.TEAM1.players[1].name}`;
    }
  }
  
  // Update modal title
  const modalTitle = endGameModal.querySelector('.end-game-main h2');
  if (modalTitle) {
    const playerTeamName = playerTeam === 'team1' 
      ? `${teams.TEAM1.players[0].name} + ${teams.TEAM1.players[1].name}`
      : `${teams.TEAM2.players[0].name} + ${teams.TEAM2.players[1].name}`;
    
    if (playerWon) {
      modalTitle.textContent = `${playerTeamName} win!`;
    } else {
      modalTitle.textContent = `${playerTeamName} lose.`;
    }
  }
  
  // Set up event listeners for the end game modal buttons
  setupEndGameModalEventListeners();
}

/**
 * Set up event listeners for the end game modal buttons
 */
function setupEndGameModalEventListeners() {
  // Play Again button
  const playAgainButton = document.querySelector('.end-game-main button');
  if (playAgainButton) {
    playAgainButton.onclick = handlePlayAgainClick;
  }
  
  // See Last Hand link
  const seeLastHandLink = document.querySelector('.end-game-details p:first-child');
  if (seeLastHandLink) {
    seeLastHandLink.onclick = handleSeeLastHandClick;
    seeLastHandLink.style.cursor = 'pointer';
  }
  
  // Your Stats link
  const yourStatsLink = document.querySelector('.end-game-details p:last-child');
  if (yourStatsLink) {
    yourStatsLink.onclick = handleYourStatsClick;
    yourStatsLink.style.cursor = 'pointer';
  }
  
  // Back to end game button (in round scoring section)
  const backToEndGameButton = document.querySelector('.back-to-end-game');
  if (backToEndGameButton) {
    backToEndGameButton.onclick = handleBackToEndGameClick;
  }
}

/**
 * Handle Play Again button click - reset game and start new game
 */
function handlePlayAgainClick() {
  console.log('Play Again clicked - starting new game');
  
  // Reset game state
  if (window.gameState && window.gameState.resetGame) {
    window.gameState.resetGame();
  }
  
  // Transition to NEW_GAME phase
  if (window.gameState && window.gameState.setCurrentPhase) {
    window.gameState.setCurrentPhase('new_game');
    window.gameState.initializeNewGame();
  }
  
  // Transition to NEW_ROUND phase
  if (window.gameState && window.gameState.setCurrentPhase) {
    window.gameState.setCurrentPhase('new_round');
    window.gameState.initializeNewRound();
  }
  
  // Transition to DEALING phase and update UI
  if (window.gameState && window.gameState.setCurrentPhase) {
    window.gameState.setCurrentPhase('dealing');
    window.gameState.updateUIForCurrentPhase();
  }
}

/**
 * Handle See Last Hand link click - show final round scoring within the modal
 */
function handleSeeLastHandClick() {
  console.log('See Last Hand clicked - showing final round scoring within modal');
  
  // Hide main end game content
  const mainContent = document.querySelector('.end-game-main');
  if (mainContent) {
    mainContent.classList.add('hidden');
  }
  
  // Show round scoring content
  const roundScoringContent = document.querySelector('.end-game-round-scoring');
  if (roundScoringContent) {
    roundScoringContent.classList.remove('hidden');
    
    // Populate the round scoring data
    populateEndGameRoundScoringData();
  }
}

/**
 * Handle Back to End Game button click - return to main end game content
 */
function handleBackToEndGameClick() {
  console.log('Back to End Game clicked - returning to main end game content');
  
  // Hide round scoring content
  const roundScoringContent = document.querySelector('.end-game-round-scoring');
  if (roundScoringContent) {
    roundScoringContent.classList.add('hidden');
  }
  
  // Show main end game content
  const mainContent = document.querySelector('.end-game-main');
  if (mainContent) {
    mainContent.classList.remove('hidden');
  }
}

/**
 * Populate the round scoring data within the end game modal
 */
function populateEndGameRoundScoringData() {
  const gameState = window.gameState.getGameState();
  const teams = window.gameSetup.TEAMS;
  
  // Get the last round data
  const lastRound = gameState.roundHistory[gameState.roundHistory.length - 1];
  if (!lastRound) {
    console.error('No round history found');
    return;
  }
  
  // Update the heading with proper team names and bid result
  const heading = document.querySelector('.end-game-round-scoring .end-game-hand-score-heading h2');
  const headingImage = document.querySelector('.end-game-round-scoring .end-game-hand-score-heading img');
  if (heading && headingImage) {
    const bidWinner = lastRound.bidWinner;
    const currentBid = lastRound.bidAmount;
    
    // Determine which team made the bid
    let team1MadeBid = false;
    let team2MadeBid = false;
    
    if (bidWinner === teams.TEAM1.players[0].name || bidWinner === teams.TEAM1.players[1].name) {
      team1MadeBid = lastRound.team1Earned >= currentBid;
      team2MadeBid = false;
    } else {
      team2MadeBid = lastRound.team2Earned >= currentBid;
      team1MadeBid = false;
    }
    
    if (team1MadeBid) {
      heading.textContent = `${teams.TEAM1.players[0].name} + ${teams.TEAM1.players[1].name} made the bid!`;
      headingImage.src = 'images/boom.png';
    } else if (team2MadeBid) {
      heading.textContent = `${teams.TEAM2.players[0].name} + ${teams.TEAM2.players[1].name} made the bid!`;
      headingImage.src = 'images/boom.png';
    } else {
      // Determine which team failed
      if (bidWinner === teams.TEAM1.players[0].name || bidWinner === teams.TEAM1.players[1].name) {
        heading.textContent = `${teams.TEAM1.players[0].name} + ${teams.TEAM1.players[1].name} failed the bid!`;
        headingImage.src = 'images/eek.png';
      } else {
        heading.textContent = `${teams.TEAM2.players[0].name} + ${teams.TEAM2.players[1].name} failed the bid!`;
        headingImage.src = 'images/eek.png';
      }
    }
  }
  
  // Update team names and scores
  const teamElements = document.querySelectorAll('.end-game-round-scoring .end-game-team');
  if (teamElements.length >= 2) {
    // Team 1 (Alex + You)
    const team1Element = teamElements[0];
    const team1NameElement = team1Element.querySelector('.end-game-names');
    const team1ScoreElement = team1Element.querySelector('.end-game-score');
    if (team1NameElement && team1ScoreElement) {
      team1NameElement.textContent = `${teams.TEAM1.players[0].name} + ${teams.TEAM1.players[1].name}`;
      team1ScoreElement.textContent = lastRound.team1Earned;
    }
    
    // Team 2 (Patricia + Jordan)
    const team2Element = teamElements[1];
    const team2NameElement = team2Element.querySelector('.end-game-names');
    const team2ScoreElement = team2Element.querySelector('.end-game-score');
    if (team2NameElement && team2ScoreElement) {
      team2NameElement.textContent = `${teams.TEAM2.players[0].name} + ${teams.TEAM2.players[1].name}`;
      team2ScoreElement.textContent = lastRound.team2Earned;
    }
  }
  
  // Update tricks won
  const tricksWonElements = document.querySelectorAll('.end-game-round-scoring .end-game-tricks-won');
  if (tricksWonElements.length >= 2) {
    // Count tricks won by each team
    let team1Tricks = 0;
    let team2Tricks = 0;
    
    gameState.roundState.trickWinners.forEach(winner => {
      if (winner === teams.TEAM1.players[0].name || winner === teams.TEAM1.players[1].name) {
        team1Tricks++;
      } else if (winner === teams.TEAM2.players[0].name || winner === teams.TEAM2.players[1].name) {
        team2Tricks++;
      }
    });
    
    tricksWonElements[0].textContent = `Tricks won: ${team1Tricks}`;
    tricksWonElements[1].textContent = `Tricks won: ${team2Tricks}`;
  }
  
  // Update cards won with actual point cards
  const teamElementsForCards = document.querySelectorAll('.end-game-round-scoring .end-game-team');
  if (teamElementsForCards.length >= 2) {
    // Team 1 cards
    const team1CardsElement = teamElementsForCards[0].querySelector('.end-game-cards-won');
    if (team1CardsElement) {
      const team1Cards = gameState.roundState.trickPoints.team1.map(card => 
        `${card.suit} ${card.value} (${card.points})`
      ).join(', ');
      team1CardsElement.textContent = team1Cards || 'No point cards won';
    }
    
    // Team 2 cards
    const team2CardsElement = teamElementsForCards[1].querySelector('.end-game-cards-won');
    if (team2CardsElement) {
      const team2Cards = gameState.roundState.trickPoints.team2.map(card => 
        `${card.suit} ${card.value} (${card.points})`
      ).join(', ');
      team2CardsElement.textContent = team2Cards || 'No point cards won';
    }
  }
}

/**
 * Handle Your Stats link click - show stats modal
 */
function handleYourStatsClick() {
  console.log('Your Stats clicked - showing stats modal');
  
  // Hide end game modal
  const endGameModal = document.querySelector('.end-game').closest('.modal-row');
  endGameModal.classList.add('hidden');
  
  // Show stats modal
  const statsModal = document.querySelector('.your-stats').closest('.modal-row');
  statsModal.classList.remove('hidden');
  
  // Populate stats with current data
  populateStatsModal();
  
  // Set up back button
  const statsBackButton = document.querySelector('.your-stats button');
  if (statsBackButton) {
    statsBackButton.onclick = handleStatsBackClick;
  }
}

/**
 * Handle Stats Back button click - return to end game modal
 */
function handleStatsBackClick() {
  console.log('Stats Back clicked - returning to end game modal');
  
  // Hide stats modal
  const statsModal = document.querySelector('.your-stats').closest('.modal-row');
  statsModal.classList.add('hidden');
  
  // Show end game modal again
  const endGameModal = document.querySelector('.end-game').closest('.modal-row');
  endGameModal.classList.remove('hidden');
}

/**
 * Make the player's hand inactive
 */
function makePlayerHandInactive() {
  const playerCards = document.querySelectorAll('.your-hand .card');
  playerCards.forEach(card => {
    card.classList.add('inactive');
  });
}

/**
 * Hide gameplay sections (play area and hand score)
 */
function hideGameplaySections() {
  // Hide the gameplay section with play area
  const gameplaySections = document.querySelectorAll('.row:not(.hidden)');
  gameplaySections.forEach(section => {
    if (section.querySelector('.play-area') && !section.querySelector('.your-hand')) {
      section.classList.add('hidden');
    }
  });
}

/**
 * Show the round scoring section
 */
function showRoundScoringSection() {
  // Find the hand score summary section (the one starting at line 233 in HTML)
  const handScoreSections = document.querySelectorAll('.row.hidden');
  handScoreSections.forEach(section => {
    if (section.querySelector('.hand-score')) {
      section.classList.remove('hidden');
    }
  });
  
  // Set up the Next button event listener
  setTimeout(() => {
    const handScoreNextButton = document.querySelector('.row:not(.hidden) .right button');
    if (handScoreNextButton) {
      console.log('Setting up hand score Next button event listener');
      handScoreNextButton.onclick = function() {
        if (window.gameState && window.gameState.handleRoundScoringNextClick) {
          window.gameState.handleRoundScoringNextClick();
        } else {
          console.error('handleRoundScoringNextClick not available');
        }
      };
    } else {
      console.error('Could not find hand score Next button');
    }
  }, 100); // Small delay to ensure DOM is ready
}

/**
 * Populate the round scoring section with actual game data
 */
function populateRoundScoringData() {
  const gameState = window.gameState.getGameState();
  const players = window.gameSetup.PLAYERS;
  
  // Determine which team made the bid
  const bidWinner = gameState.roundState.bidWinner;
  const currentBid = gameState.roundState.currentBid;
  let team1MadeBid = false;
  let team2MadeBid = false;
  
  if (bidWinner === players.PLAYER1.name || bidWinner === players.PLAYER3.name) {
    team1MadeBid = gameState.roundState.team1Score >= currentBid;
    team2MadeBid = false;
  } else {
    team2MadeBid = gameState.roundState.team2Score >= currentBid;
    team1MadeBid = false;
  }
  
  // Update the heading and image
  const heading = document.querySelector('.hand-score-heading h2');
  const headingImage = document.querySelector('.hand-score-heading img');
  
  if (heading && headingImage) {
    if (team1MadeBid) {
      heading.textContent = 'Alex + You made the bid!';
      headingImage.src = 'images/boom.png';
    } else if (team2MadeBid) {
      heading.textContent = 'Patricia + Jordan made the bid!';
      headingImage.src = 'images/boom.png';
    } else {
      // Determine which team failed
      if (bidWinner === players.PLAYER1.name || bidWinner === players.PLAYER3.name) {
        heading.textContent = 'Alex + You failed the bid!';
        headingImage.src = 'images/eek.png';
      } else {
        heading.textContent = 'Patricia + Jordan failed the bid!';
        headingImage.src = 'images/eek.png';
      }
    }
  }
  
  // Update team scores and point cards
  updateTeamScoreDisplay('team1', gameState.roundState.team1Score, gameState.roundState.trickPoints.team1);
  updateTeamScoreDisplay('team2', gameState.roundState.team2Score, gameState.roundState.trickPoints.team2);
  
  // Update tricks won
  updateTricksWonDisplay();
  
  // Update the quote with a random one
  updateRandomQuote();
}

/**
 * Update the quote with a random one
 */
function updateRandomQuote() {
  // Get a random quote from the main.js quotes array
  const randomQuote = window.getRandomQuote ? window.getRandomQuote() : "Winning is in the eye of the beholder. ~ Cake Boss";
  
  // Update all quotable elements
  const quotableElements = document.querySelectorAll('.quotable p');
  quotableElements.forEach(element => {
    element.textContent = `"${randomQuote}"`;
  });
}

/**
 * Update team score display in the hand score section
 */
function updateTeamScoreDisplay(teamKey, score, pointCards) {
  const teamElements = document.querySelectorAll('.hand-score-team .team');
  let teamElement;
  
  if (teamKey === 'team1') {
    teamElement = teamElements[0]; // First team (Alex + You)
  } else {
    teamElement = teamElements[1]; // Second team (Patricia + Jordan)
  }
  
  if (!teamElement) return;
  
  // Update score
  const scoreElement = teamElement.querySelector('.score');
  if (scoreElement) {
    scoreElement.textContent = score;
  }
  
  // Update team names to match the actual team composition
  const namesElement = teamElement.querySelector('.names');
  if (namesElement) {
    if (teamKey === 'team1') {
      namesElement.textContent = 'Alex + You';
    } else {
      namesElement.textContent = 'Patricia + Jordan';
    }
  }
  
  // Update point cards
  const cardsWonElement = teamElement.querySelector('.cards-won');
  if (cardsWonElement) {
    cardsWonElement.innerHTML = '';
    
    // Add point card dots
    pointCards.forEach(card => {
      const dotElement = document.createElement('span');
      
      // Handle special cards (kitty)
      if (card.source === 'kitty') {
        dotElement.className = `dot ${card.suit} kitty`;
        dotElement.textContent = card.value;
        dotElement.title = `Kitty: ${card.suit} ${card.value} (${card.points} pts)`;
      } else {
        // Regular point cards
        dotElement.className = `dot ${card.suit}`;
        dotElement.textContent = card.value;
      }
      
      cardsWonElement.appendChild(dotElement);
    });
    
    // Check if this team won the last trick (worth 20 points)
    const gameState = window.gameState.getGameState();
    const players = window.gameSetup.PLAYERS;
    const lastTrickWinner = gameState.roundState.trickWinners[gameState.roundState.trickWinners.length - 1];
    
    let teamWonLastTrick = false;
    if (teamKey === 'team1') {
      teamWonLastTrick = (lastTrickWinner === players.PLAYER1.name || lastTrickWinner === players.PLAYER3.name);
    } else {
      teamWonLastTrick = (lastTrickWinner === players.PLAYER0.name || lastTrickWinner === players.PLAYER2.name);
    }
    
    if (teamWonLastTrick) {
      const lastTrickElement = document.createElement('span');
      lastTrickElement.className = 'last-trick';
      lastTrickElement.textContent = 'Last trick';
      cardsWonElement.appendChild(lastTrickElement);
    }
  }
}

/**
 * Update tricks won display
 */
function updateTricksWonDisplay() {
  const gameState = window.gameState.getGameState();
  const players = window.gameSetup.PLAYERS;
  
  // Count tricks won by each team
  let team1Tricks = 0;
  let team2Tricks = 0;
  
  gameState.roundState.trickWinners.forEach(winner => {
    if (winner === players.PLAYER1.name || winner === players.PLAYER3.name) {
      team1Tricks++;
    } else if (winner === players.PLAYER0.name || winner === players.PLAYER2.name) {
      team2Tricks++;
    }
  });
  
  // Update tricks won display
  const tricksWonElements = document.querySelectorAll('.tricks-won');
  if (tricksWonElements[0]) {
    tricksWonElements[0].textContent = `Tricks won: ${team1Tricks}`;
  }
  if (tricksWonElements[1]) {
    tricksWonElements[1].textContent = `Tricks won: ${team2Tricks}`;
  }
}

/**
 * Get current game scores for the score update UI
 * @returns {Object} Object containing team scores and names
 */
function getCurrentGameScores() {
  const gameState = window.gameState.getGameState();
  const teams = window.gameSetup.TEAMS;
  return {
    team1Score: gameState.scores.team1,
    team2Score: gameState.scores.team2,
    team1Name: `${teams.TEAM1.players[0].name} + ${teams.TEAM1.players[1].name}`,
    team2Name: `${teams.TEAM2.players[0].name} + ${teams.TEAM2.players[1].name}`
  };
}

/**
 * Get round history for the hand-by-hand table
 * @returns {Array} Array of round records
 */
function getRoundHistory() {
  const gameState = window.gameState.getGameState();
  return gameState.roundHistory;
}

/**
 * Get the current round number
 * @returns {number} Current round number
 */
function getCurrentRoundNumber() {
  const gameState = window.gameState.getGameState();
  return gameState.currentHand;
}

// Add touch event support for iPad compatibility
function addTouchSupport() {
  // Add touchstart events to all clickable elements
  const clickableElements = document.querySelectorAll('button, .card, .power-suit, .tab');
  
  clickableElements.forEach(element => {
    element.addEventListener('touchstart', function(e) {
      e.preventDefault(); // Prevent double-tap zoom on iPad
      this.click(); // Trigger the existing click handler
    }, { passive: false });
  });
}

/**
 * Stats Management Functions
 */

// Default stats structure
const DEFAULT_STATS = {
  // Basic stats
  totalGames: 0,
  gamesWon: 0,
  gamesLost: 0,
  winPercentage: 0,
  
  // Enhanced stats
  totalPoints: 0,
  averagePointsPerGame: 0,
  longestWinStreak: 0,
  currentWinStreak: 0,
  bestRoundScore: 0,
  mostPointsInOneTrick: 0,
  perfectRounds: 0, // Rounds with 200 points
  bidSuccessRate: 0,
  totalBids: 0,
  successfulBids: 0,
  
  // Game history (last 10 games for trends)
  recentGames: [],
  
  lastUpdated: null
};

/**
 * Load player stats from localStorage
 * @returns {Object} Player stats object
 */
function loadPlayerStats() {
  try {
    const storedStats = localStorage.getItem('dunkStats');
    if (storedStats) {
      const stats = JSON.parse(storedStats);
      // Merge with defaults in case new fields are added
      return { ...DEFAULT_STATS, ...stats };
    }
  } catch (error) {
    console.error('Error loading stats from localStorage:', error);
  }
  return { ...DEFAULT_STATS };
}

/**
 * Save player stats to localStorage
 * @param {Object} stats - Stats object to save
 */
function savePlayerStats(stats) {
  try {
    stats.lastUpdated = new Date().toISOString();
    localStorage.setItem('dunkStats', JSON.stringify(stats));
    console.log('Stats saved successfully:', stats);
  } catch (error) {
    console.error('Error saving stats to localStorage:', error);
  }
}

/**
 * Update stats when a game ends
 * @param {boolean} playerWon - Whether the player's team won
 * @param {Object} gameData - Additional game data for enhanced stats
 */
function updateGameStats(playerWon, gameData = {}) {
  const stats = loadPlayerStats();
  const gameState = window.gameState.getGameState();
  
  // Basic stats
  stats.totalGames++;
  if (playerWon) {
    stats.gamesWon++;
    stats.currentWinStreak++;
    if (stats.currentWinStreak > stats.longestWinStreak) {
      stats.longestWinStreak = stats.currentWinStreak;
    }
  } else {
    stats.gamesLost++;
    stats.currentWinStreak = 0;
  }
  
  // Calculate win percentage
  stats.winPercentage = stats.totalGames > 0 ? 
    Math.round((stats.gamesWon / stats.totalGames) * 100 * 10) / 10 : 0;
  
  // Enhanced stats
  if (gameData.finalScore) {
    stats.totalPoints += gameData.finalScore;
    stats.averagePointsPerGame = Math.round(stats.totalPoints / stats.totalGames);
    
    // Track best round score
    if (gameData.finalScore > stats.bestRoundScore) {
      stats.bestRoundScore = gameData.finalScore;
    }
  }
  
  // Track perfect rounds (200 points)
  if (gameData.finalScore === 200) {
    stats.perfectRounds++;
  }
  
  // Track bid success rate
  if (gameData.bidAmount !== undefined) {
    stats.totalBids++;
    if (gameData.bidMade) {
      stats.successfulBids++;
    }
    stats.bidSuccessRate = stats.totalBids > 0 ? 
      Math.round((stats.successfulBids / stats.totalBids) * 100 * 10) / 10 : 0;
  }
  
  // Track most points in one trick
  if (gameData.maxTrickPoints && gameData.maxTrickPoints > stats.mostPointsInOneTrick) {
    stats.mostPointsInOneTrick = gameData.maxTrickPoints;
  }
  
  // Add to recent games history (keep last 10)
  const gameRecord = {
    date: new Date().toISOString(),
    won: playerWon,
    score: gameData.finalScore || 0,
    bidAmount: gameData.bidAmount || 0,
    bidMade: gameData.bidMade || false
  };
  
  stats.recentGames.unshift(gameRecord);
  if (stats.recentGames.length > 10) {
    stats.recentGames = stats.recentGames.slice(0, 10);
  }
  
  savePlayerStats(stats);
  console.log('Enhanced game stats updated:', stats);
}

/**
 * Clear all player stats
 */
function clearPlayerStats() {
  try {
    localStorage.removeItem('dunkStats');
    console.log('Player stats cleared');
    return true;
  } catch (error) {
    console.error('Error clearing stats:', error);
    return false;
  }
}

/**
 * Populate the stats modal with current player stats
 */
function populateStatsModal() {
  const stats = loadPlayerStats();
  
  // Update stats display
  const statsDetails = document.querySelector('.your-stats .stats-details');
  if (statsDetails) {
    // Clear existing content
    statsDetails.innerHTML = '';
    
    // Basic stats
    addStatLine(statsDetails, `Total games played: ${stats.totalGames}`);
    addStatLine(statsDetails, `Games won: ${stats.gamesWon}`);
    addStatLine(statsDetails, `Games lost: ${stats.gamesLost}`);
    addStatLine(statsDetails, `Win %: ${stats.winPercentage}%`);
    
    // Enhanced stats (only show if there's data)
    if (stats.totalGames > 0) {
      addStatLine(statsDetails, `Average points per game: ${stats.averagePointsPerGame}`);
      addStatLine(statsDetails, `Best round score: ${stats.bestRoundScore}`);
      addStatLine(statsDetails, `Perfect rounds: ${stats.perfectRounds}`);
      addStatLine(statsDetails, `Longest win streak: ${stats.longestWinStreak}`);
      addStatLine(statsDetails, `Current win streak: ${stats.currentWinStreak}`);
      
      if (stats.totalBids > 0) {
        addStatLine(statsDetails, `Bid success rate: ${stats.bidSuccessRate}%`);
      }
      
      if (stats.mostPointsInOneTrick > 0) {
        addStatLine(statsDetails, `Most points in one trick: ${stats.mostPointsInOneTrick}`);
      }
    }
    
    // Add clear stats option
    const clearStatsElement = document.createElement('p');
    clearStatsElement.textContent = 'Clear my stats';
    clearStatsElement.style.cursor = 'pointer';
    clearStatsElement.onclick = handleClearStatsClick;
    statsDetails.appendChild(clearStatsElement);
  }
}

/**
 * Helper function to add a stat line to the stats modal
 * @param {Element} container - Container element
 * @param {string} text - Stat text to display
 */
function addStatLine(container, text) {
  const statLine = document.createElement('p');
  statLine.textContent = text;
  container.appendChild(statLine);
}

/**
 * Calculate the maximum points won in a single trick during the game
 * @returns {number} Maximum points in one trick
 */
function calculateMaxTrickPoints() {
  const gameState = window.gameState.getGameState();
  let maxTrickPoints = 0;
  
  // This would need to be tracked during gameplay
  // For now, we'll calculate from the final round data
  if (gameState.roundState.trickPoints && gameState.roundState.trickPoints.team1) {
    const team1Points = gameState.roundState.trickPoints.team1.reduce((sum, card) => sum + card.points, 0);
    const team2Points = gameState.roundState.trickPoints.team2.reduce((sum, card) => sum + card.points, 0);
    maxTrickPoints = Math.max(team1Points, team2Points);
  }
  
  return maxTrickPoints;
}

/**
 * Handle clear stats click
 */
function handleClearStatsClick() {
  if (confirm('Are you sure you want to clear all your stats? This cannot be undone.')) {
    if (clearPlayerStats()) {
      // Refresh the stats display
      populateStatsModal();
      alert('Stats cleared successfully!');
    } else {
      alert('Error clearing stats. Please try again.');
    }
  }
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
  trackTrickPoints,

  logRoundEndSummary,
  markWinningCard,
  showNextTrickButton,
  showFinalRoundButton,
  handleFinalTrickRewards,
  transitionToRoundScoring,
  makePlayerHandInactive,
  hideGameplaySections,
  showRoundScoringSection,
  populateRoundScoringData,
  updateTeamScoreDisplay,
  updateTricksWonDisplay,
  calculateEndOfRoundScores,
  checkForGameEnd,
  showEndGameModal,
  setupEndGameModalEventListeners,
  handlePlayAgainClick,
  handleSeeLastHandClick,
  handleBackToEndGameClick,
  populateEndGameRoundScoringData,
  handleYourStatsClick,
  handleStatsBackClick,
  getCurrentGameScores,
  getRoundHistory,
  getCurrentRoundNumber,
  startAITurn,
  playAICard,
  playAICardToPlayArea,
  removeCardFromAIHand,
  updateGameStateAfterAICardPlay,
  proceedToNextTrick,
  clearPlayArea,
  addTouchSupport,
  updateGameStats,
  clearPlayerStats,
  populateStatsModal,
  handleClearStatsClick,
  loadPlayerStats,
  savePlayerStats,
  addStatLine,
  calculateMaxTrickPoints,
  updateRandomQuote
};

console.log('gameplay exported:', Object.keys(window.gameplay));

// Test function to simulate end game (for debugging)
window.testEndGame = function() {
  console.log('Testing end game...');
  const gameState = window.gameState.getGameState();
  gameState.scores.team1 = 500;
  gameState.scores.team2 = 300;
  checkForGameEnd();
};

// Initialize stats when the game loads
window.initializeStats = function() {
  console.log('Initializing player stats...');
  const stats = loadPlayerStats();
  console.log('Current player stats:', stats);
};

// Call initialization when the script loads
if (typeof window !== 'undefined') {
  window.initializeStats();
}

/**
 * Get player seat number by player name
 * @param {string} playerName - Name of the player
 * @returns {number} Seat number (0-3)
 */
function getPlayerSeat(playerName) {
  const players = window.gameSetup.PLAYERS;
  if (playerName === players.PLAYER0.name) return 0; // Patricia
  if (playerName === players.PLAYER1.name) return 1; // Alex
  if (playerName === players.PLAYER2.name) return 2; // Jordan
  if (playerName === players.PLAYER3.name) return 3; // You
  return 0; // Default fallback
}

/**
 * Get the current winner of the trick
 * @param {Array} playedCards - Cards played in current trick
 * @param {string} powerSuit - Current power suit
 * @returns {Object|null} Winner object or null if no cards played
 */
function getCurrentTrickWinner(playedCards, powerSuit) {
  if (playedCards.length === 0) return null;
  
  // Check if AI module is available
  if (!window.ai || !window.ai.getCurrentWinner) {
    console.warn('AI module not available for getCurrentWinner, using fallback logic');
    // Fallback logic for determining winner
    if (playedCards.length === 0) return null;
    
    let winner = playedCards[0];
    const leadSuit = playedCards[0].card.suit === 'dunk' ? powerSuit : playedCards[0].card.suit;
    
    for (let i = 1; i < playedCards.length; i++) {
      const current = playedCards[i];
      const currentValue = getCardValue(current.card.value);
      const winnerValue = getCardValue(winner.card.value);
      
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
  
  // Use AI logic to determine winner
  return window.ai.getCurrentWinner(playedCards, powerSuit);
}

// Helper function for card values (fallback)
function getCardValue(value) {
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "1", "D"];
  return values.indexOf(value);
}
