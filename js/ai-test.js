/**
 * Simple test file for AI functionality
 * Run this in the browser console to test AI logic
 */

console.log('ai-test.js is loading...');

// Test data
const testHand = [
  { suit: 'orange', value: '1' },
  { suit: 'yellow', value: '14' },
  { suit: 'blue', value: '13' },
  { suit: 'green', value: '10' },
  { suit: 'dunk', value: 'D' },
  { suit: 'orange', value: '5' },
  { suit: 'yellow', value: '7' },
  { suit: 'blue', value: '2' },
  { suit: 'green', value: '8' },
  { suit: 'orange', value: '12' },
  { suit: 'yellow', value: '3' },
  { suit: 'blue', value: '9' },
  { suit: 'green', value: '6' }
];

// Patricia's actual hand (before kitty)
const patriciaHand = [
  { suit: 'yellow', value: '3' },
  { suit: 'blue', value: '3' },
  { suit: 'orange', value: '11' },
  { suit: 'green', value: '10' },
  { suit: 'blue', value: '12' },
  { suit: 'yellow', value: '13' },
  { suit: 'yellow', value: '2' },
  { suit: 'green', value: '6' },
  { suit: 'green', value: '4' },
  { suit: 'yellow', value: '11' },
  { suit: 'blue', value: '8' },
  { suit: 'yellow', value: '8' },
  { suit: 'dunk', value: 'D' },
  { suit: 'blue', value: '5' },
  { suit: 'blue', value: '4' },
  { suit: 'green', value: '3' },
  { suit: 'green', value: '1' },
  { suit: 'orange', value: '12' }
];

// Patricia's hand after kitty (she kept 13 cards)
const patriciaHandAfterKitty = [
  { suit: 'blue', value: '8' },
  { suit: 'dunk', value: 'D' },
  { suit: 'blue', value: '12' },
  { suit: 'yellow', value: '11' },
  { suit: 'yellow', value: '13' },
  { suit: 'green', value: '3' },
  { suit: 'green', value: '6' },
  { suit: 'orange', value: '12' },
  { suit: 'yellow', value: '3' },
  { suit: 'blue', value: '4' },
  { suit: 'orange', value: '11' },
  { suit: 'green', value: '10' },
  { suit: 'blue', value: '3' }
];

const testPlayedCards = [
  { card: { suit: 'orange', value: '14' }, player: 'Patricia' },
  { card: { suit: 'yellow', value: '1' }, player: 'Alex' }
];

function testAI() {
  console.log('Testing AI functionality...');
  
  // Check if AI module is available
  if (!window.ai) {
    console.error('AI module not loaded! Please refresh the page and try again.');
    return;
  }
  
  console.log('AI module loaded successfully:', Object.keys(window.ai));
  
  try {
    // Test hand strength evaluation
    console.log('Hand strength with orange power suit:', window.ai.evaluateHandStrength(testHand, 'orange'));
    console.log('Hand strength with yellow power suit:', window.ai.evaluateHandStrength(testHand, 'yellow'));
    
    // Test power suit selection
    console.log('Best power suit:', window.ai.chooseBestPowerSuit(testHand));
    
    // Test bidding
    console.log('AI bid (no current bid):', window.ai.chooseAIBid(testHand, 0));
    console.log('AI bid (current bid 80):', window.ai.chooseAIBid(testHand, 80));
    console.log('AI bid (current bid 200):', window.ai.chooseAIBid(testHand, 200));
    
    // Test card selection
    const validCards = window.ai.getValidCards(testHand, testPlayedCards, 'orange');
    console.log('Valid cards to play:', validCards);
    
    const selectedCard = window.ai.selectAICard('TestAI', testHand, testPlayedCards, 'orange', 0, 1);
    console.log('Selected card:', selectedCard);
    
    console.log('AI test complete!');
  } catch (error) {
    console.error('Error during AI test:', error);
  }
}

function testPatriciaHand() {
  console.log('Testing Patricia\'s actual hand...');
  
  if (!window.ai) {
    console.error('AI module not loaded!');
    return;
  }
  
  try {
    // Test Patricia's hand strength
    console.log('Patricia hand strength with yellow power suit:', window.ai.evaluateHandStrength(patriciaHand, 'yellow'));
    console.log('Patricia hand strength with blue power suit:', window.ai.evaluateHandStrength(patriciaHand, 'blue'));
    console.log('Patricia hand strength with orange power suit:', window.ai.evaluateHandStrength(patriciaHand, 'orange'));
    console.log('Patricia hand strength with green power suit:', window.ai.evaluateHandStrength(patriciaHand, 'green'));
    
    // Test power suit selection
    console.log('Patricia best power suit:', window.ai.chooseBestPowerSuit(patriciaHand));
    
    // Test bidding with Patricia's hand
    console.log('Patricia AI bid (no current bid):', window.ai.chooseAIBid(patriciaHand, 0));
    
    // Test kitty management (simulate what she should have done)
    const kitty = [
      { suit: 'blue', value: '8' },
      { suit: 'dunk', value: 'D' },
      { suit: 'blue', value: '12' },
      { suit: 'yellow', value: '11' },
      { suit: 'yellow', value: '13' }
    ];
    
    const kittyResult = window.ai.manageKitty(patriciaHand, kitty, 'blue');
    console.log('Patricia should keep:', kittyResult.keep.map(c => `${c.suit} ${c.value}`));
    console.log('Patricia should return:', kittyResult.return.map(c => `${c.suit} ${c.value}`));
    
    console.log('Patricia test complete!');
  } catch (error) {
    console.error('Error during Patricia test:', error);
  }
}

// Test Alex's hand (you'll need to replace this with his actual hand)
const alexHand = [
  // Replace this with Alex's actual hand from your game
  { suit: 'orange', value: '1' },
  { suit: 'yellow', value: '14' },
  { suit: 'blue', value: '13' },
  { suit: 'green', value: '10' },
  { suit: 'dunk', value: 'D' },
  { suit: 'orange', value: '5' },
  { suit: 'yellow', value: '7' },
  { suit: 'blue', value: '2' },
  { suit: 'green', value: '8' },
  { suit: 'orange', value: '12' },
  { suit: 'yellow', value: '3' },
  { suit: 'blue', value: '9' },
  { suit: 'green', value: '6' }
];

// Test Jordan's hand (you'll need to replace this with his actual hand)
const jordanHand = [
  // Replace this with Jordan's actual hand from your game
  { suit: 'orange', value: '1' },
  { suit: 'yellow', value: '14' },
  { suit: 'blue', value: '13' },
  { suit: 'green', value: '10' },
  { suit: 'dunk', value: 'D' },
  { suit: 'orange', value: '5' },
  { suit: 'yellow', value: '7' },
  { suit: 'blue', value: '2' },
  { suit: 'green', value: '8' },
  { suit: 'orange', value: '12' },
  { suit: 'yellow', value: '3' },
  { suit: 'blue', value: '9' },
  { suit: 'green', value: '6' }
];

function testAlexHand() {
  console.log('Testing Alex\'s hand...');
  
  if (!window.ai) {
    console.error('AI module not loaded!');
    return;
  }
  
  try {
    // Test Alex's hand strength
    console.log('Alex hand strength with yellow power suit:', window.ai.evaluateHandStrength(alexHand, 'yellow'));
    console.log('Alex hand strength with blue power suit:', window.ai.evaluateHandStrength(alexHand, 'blue'));
    console.log('Alex hand strength with orange power suit:', window.ai.evaluateHandStrength(alexHand, 'orange'));
    console.log('Alex hand strength with green power suit:', window.ai.evaluateHandStrength(alexHand, 'green'));
    
    // Test power suit selection
    console.log('Alex best power suit:', window.ai.chooseBestPowerSuit(alexHand));
    
    // Test bidding with Alex's hand
    console.log('Alex AI bid (no current bid):', window.ai.chooseAIBid(alexHand, 0));
    
    console.log('Alex test complete!');
  } catch (error) {
    console.error('Error during Alex test:', error);
  }
}

function testJordanHand() {
  console.log('Testing Jordan\'s hand...');
  
  if (!window.ai) {
    console.error('AI module not loaded!');
    return;
  }
  
  try {
    // Test Jordan's hand strength
    console.log('Jordan hand strength with yellow power suit:', window.ai.evaluateHandStrength(jordanHand, 'yellow'));
    console.log('Jordan hand strength with blue power suit:', window.ai.evaluateHandStrength(jordanHand, 'blue'));
    console.log('Jordan hand strength with orange power suit:', window.ai.evaluateHandStrength(jordanHand, 'orange'));
    console.log('Jordan hand strength with green power suit:', window.ai.evaluateHandStrength(jordanHand, 'green'));
    
    // Test power suit selection
    console.log('Jordan best power suit:', window.ai.chooseBestPowerSuit(jordanHand));
    
    // Test bidding with Jordan's hand
    console.log('Jordan AI bid (no current bid):', window.ai.chooseAIBid(jordanHand, 0));
    
    console.log('Jordan test complete!');
  } catch (error) {
    console.error('Error during Jordan test:', error);
  }
}

// Test strategic point-throwing logic
function testStrategicPointThrowing() {
  console.log('Testing strategic point-throwing logic...');
  
  if (!window.ai) {
    console.error('AI module not loaded!');
    return;
  }
  
  try {
    // Test team determination
    console.log('Alex team:', window.ai.getPlayerTeam('Alex'));
    console.log('Patricia team:', window.ai.getPlayerTeam('Patricia'));
    console.log('Jordan team:', window.ai.getPlayerTeam('Jordan'));
    console.log('You team:', window.ai.getPlayerTeam('You'));
    
    // Test teammate detection
    console.log('Alex and You are teammates:', window.ai.areTeammates('Alex', 'You'));
    console.log('Patricia and Jordan are teammates:', window.ai.areTeammates('Patricia', 'Jordan'));
    console.log('Alex and Patricia are teammates:', window.ai.areTeammates('Alex', 'Patricia'));
    
    // Test card point values
    console.log('Dunk card points:', window.ai.getCardPoints({ suit: 'dunk', value: 'D' }));
    console.log('1 card points:', window.ai.getCardPoints({ suit: 'orange', value: '1' }));
    console.log('14 card points:', window.ai.getCardPoints({ suit: 'yellow', value: '14' }));
    console.log('10 card points:', window.ai.getCardPoints({ suit: 'green', value: '10' }));
    console.log('5 card points:', window.ai.getCardPoints({ suit: 'blue', value: '5' }));
    console.log('2 card points:', window.ai.getCardPoints({ suit: 'orange', value: '2' }));
    
    // Test strategic card selection scenarios
    const testHand = [
      { suit: 'orange', value: '1' },   // 15 points
      { suit: 'yellow', value: '14' },  // 10 points
      { suit: 'blue', value: '5' },     // 5 points
      { suit: 'green', value: '2' }     // 0 points
    ];
    
    // Scenario 1: Teammate is winning, AI has point cards
    const teammateWinningScenario = [
      { card: { suit: 'orange', value: '14' }, player: 'Alex' }  // Alex (teammate) is winning
    ];
    
    console.log('=== Scenario 1: Teammate winning, AI has point cards ===');
    const card1 = window.ai.selectAICard('You', testHand, teammateWinningScenario, 'blue', 3, 1);
    console.log('Selected card:', card1);
    
    // Scenario 2: Opponent is winning, AI has both point and non-point cards
    const opponentWinningScenario = [
      { card: { suit: 'orange', value: '14' }, player: 'Patricia' }  // Patricia (opponent) is winning
    ];
    
    console.log('=== Scenario 2: Opponent winning, AI has both point and non-point cards ===');
    const card2 = window.ai.selectAICard('You', testHand, opponentWinningScenario, 'blue', 3, 0);
    console.log('Selected card:', card2);
    
    // Scenario 3: Opponent is winning, AI only has point cards
    const onlyPointCardsHand = [
      { suit: 'orange', value: '1' },   // 15 points
      { suit: 'yellow', value: '14' },  // 10 points
      { suit: 'blue', value: '5' }      // 5 points
    ];
    
    console.log('=== Scenario 3: Opponent winning, AI only has point cards ===');
    const card3 = window.ai.selectAICard('You', onlyPointCardsHand, opponentWinningScenario, 'blue', 3, 0);
    console.log('Selected card:', card3);
    
    console.log('Strategic point-throwing test complete!');
  } catch (error) {
    console.error('Error during strategic test:', error);
  }
}

// Simple function to check if AI is loaded
function checkAI() {
  console.log('Checking AI module status...');
  console.log('window.ai exists:', !!window.ai);
  if (window.ai) {
    console.log('AI module keys:', Object.keys(window.ai));
  } else {
    console.log('AI module not found. Available window objects with "ai":', 
                Object.keys(window).filter(key => key.includes('ai')));
  }
}

// Export for console testing
window.testAI = testAI;
window.testPatriciaHand = testPatriciaHand;
window.testAlexHand = testAlexHand;
window.testJordanHand = testJordanHand;
window.checkAI = checkAI;
window.testStrategicPointThrowing = testStrategicPointThrowing;

console.log('ai-test.js loaded, checkAI(), testAI(), testPatriciaHand(), testAlexHand(), testJordanHand(), and testStrategicPointThrowing() are available');
