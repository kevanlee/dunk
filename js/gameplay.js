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

// Export functions for use in other modules
window.gameplay = {
  getNextPlayer,
  determineTrickWinner,
  updateTrickLeader,
  updatePlayerNamesInUI
};

console.log('gameplay exported:', Object.keys(window.gameplay));
