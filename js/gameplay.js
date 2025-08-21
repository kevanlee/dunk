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
  
  // Check if player has cards of the led suit (including Dunk card if it matches the power suit)
  const powerSuit = gameState.roundState.powerSuit;
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
  const ledSuit = playedCards[0].card.suit;
  
  // Determine trick winner
  const trickWinner = determineTrickWinner(playedCards, powerSuit, ledSuit);
  
  console.log(`Trick complete! Winner: ${trickWinner}`);
  
  // Track point cards won in this trick
  trackTrickPoints(playedCards, trickWinner);
  
  // Log remaining cards in player's hand
  logPlayerHandRemaining();
  
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
  const ledSuit = playedCards[0].card.suit;
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
 * Log the remaining cards in the player's hand
 */
function logPlayerHandRemaining() {
  const gameState = window.gameState.getGameState();
  const playerHand = gameState.playerHand;
  
  // Also check what's actually in the DOM
  const cardLayout = document.querySelector('.your-hand .card-layout');
  const domCards = cardLayout ? cardLayout.querySelectorAll('.card') : [];
  
  console.log(`=== HAND COMPARISON ===`);
  console.log(`Game state hand: ${playerHand ? playerHand.length : 0} cards`);
  console.log(`DOM cards: ${domCards.length} cards`);
  
  if (playerHand && playerHand.length > 0) {
    const sortedHand = window.cardLogic.sortHand(playerHand);
    const cardList = sortedHand.map(card => `${card.suit} ${card.value}`).join(', ');
    console.log(`Your remaining cards (${playerHand.length}): ${cardList}`);
  } else {
    console.log('Your hand is empty');
  }
  
  if (domCards.length > 0) {
    const domCardList = Array.from(domCards).map(card => {
      const cardText = card.textContent.trim();
      const cardSuit = card.className.includes('dunk') ? 'dunk' : 
                      card.className.includes('orange') ? 'orange' :
                      card.className.includes('yellow') ? 'yellow' :
                      card.className.includes('blue') ? 'blue' : 'green';
      return `${cardSuit} ${cardText}`;
    }).join(', ');
    console.log(`DOM cards (${domCards.length}): ${domCardList}`);
  }
  console.log(`=======================`);
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
  
  // Check for game end (500 points)
  checkForGameEnd();
}

/**
 * Check if either team has reached 500 points to end the game
 */
function checkForGameEnd() {
  const gameState = window.gameState.getGameState();
  const winningScore = window.gameSetup.GAME_CONSTANTS.WINNING_SCORE;
  
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
    
    // TODO: Transition to end game phase
    // For now, just log the game end
  }
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
  logPlayerHandRemaining,
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
  addTouchSupport
};

console.log('gameplay exported:', Object.keys(window.gameplay));
