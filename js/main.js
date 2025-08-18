
/**
 * Game State Management
 * Handles the current phase of the game and state transitions
 */

// Game phases in order of progression
const GAME_PHASES = {
  WELCOME: 'welcome',
  DEALING: 'dealing', 
  BIDDING: 'bidding',
  GAMEPLAY: 'gameplay',
  SCORING: 'scoring',
  END: 'end'
};

// Current game state
let gameState = {
  currentPhase: GAME_PHASES.WELCOME,
  // TODO: Add more state properties as needed
  // - player hands
  // - scores
  // - current bid
  // - power suit
  // - etc.
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
    currentPhase: GAME_PHASES.WELCOME
    // TODO: Reset all other state properties
  };
  console.log('Game reset complete');
}

/**
 * Initialize the game state
 */
function initializeGameState() {
  console.log('Initializing game state...');
  gameState = {
    currentPhase: GAME_PHASES.WELCOME
  };
  console.log('Game state initialized. Current phase:', gameState.currentPhase);
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
  document.addEventListener('DOMContentLoaded', initializeGameState);

  // Export functions for testing and external use
  window.gameState = {
    getGameState,
    getCurrentPhase,
    setCurrentPhase,
    nextPhase,
    navigateToPhase,
    resetGame,
    initializeGameState,
    GAME_PHASES
  };