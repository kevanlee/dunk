/**
 * Game Setup and Configuration
 * Contains player definitions, team structures, and game constants
 */

// Player structure - 4 players around the table
const PLAYERS = {
  PLAYER0: { name: "Patricia", position: 0, team: 2 },
  PLAYER1: { name: "Alex", position: 1, team: 1 },
  PLAYER2: { name: "Jordan", position: 2, team: 2 },
  PLAYER3: { name: "You", position: 3, team: 1 }
};

// Team structure
const TEAMS = {
  TEAM1: { players: [PLAYERS.PLAYER1, PLAYERS.PLAYER3], score: 0 }, // Alex + You
  TEAM2: { players: [PLAYERS.PLAYER0, PLAYERS.PLAYER2], score: 0 }  // Patricia + Jordan
};

// Game constants
const GAME_CONSTANTS = {
  WINNING_SCORE: 500,
  CARDS_PER_PLAYER: 13,
  KITTY_SIZE: 5,
  MIN_BID: 70,
  MAX_BID: 200,
  BID_INCREMENT: 5
};

// Export for use in other modules
window.gameSetup = {
  PLAYERS,
  TEAMS,
  GAME_CONSTANTS
};

console.log('gameSetup exported:', Object.keys(window.gameSetup));
