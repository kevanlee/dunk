# AI Strategy Notes for Dunk Card Game

## Overview
This document outlines a complete AI strategy system for the Dunk card game. It's designed to be understandable by smart non-technical people who want to understand and improve the AI.

## Key Concepts Explained

### What is "AI" in a card game?
Think of AI as a set of rules that tell the computer how to make decisions. Instead of randomly picking cards, we give the computer strategies that good human players use.

### Dunk rules (see README.md)
- Players take turns playing cards
- The highest card wins the "trick". Card rank is 1, 14, 13, 12, ...
- Players must "follow suit" (play the same suit as the first card) if they can
- Exception: A power suit card beats other cards that are played in the trick
- The Dunk card is valued at 10.5 and takes on the claimed power suit of the round

### Hand strength
How good your cards are. We calculate this by looking at:
- High-value cards (1s, 14s, 13s, etc.)
- Long suits (having many cards of the same suit)
- "Control" cards (highest card of a suit)
- "Voids" (not having any cards of a suit - can be good for trumping)

## Current State
- Basic random card selection (very simple)
- Valid card filtering works (follows game rules)
- No strategic thinking implemented yet

## What the AI Needs to Decide

### 1. Bid amount (or pass)
When it's your turn to bid, how much should you bid, or should you pass?

### 2. Power suit choice (if you win the bid)
If you win the bidding, which suit should be the power suit?

### 3. Kitty management (if you win the bid)
If you win the bidding, which cards should you keep from the kitty and which should you put back in the kitty?

### 4. Card to play each trick
Which card should you play when it's your turn?

## File Structure (Single file to start)

The AI will be organized into these sections:
- **Config and weights** - Easy-to-change settings
- **Helper functions** - Small, reusable tools
- **Hand strength evaluator** - How good is your hand?
- **Bidding logic** - How much to bid
- **Trump choice** - Which suit to pick
- **Card play logic** - Which card to play
- **Memory system** - Remembering what opponents played

## Data the AI Receives

We pass a single `context` object to all decisions to keep things simple:

```javascript
// This is what the game engine gives to the AI
const context = {
  seat: 0,                    // Your seat number (0-3)
  players: 4,                 // Total players
  rules: {                    // Game rules
    mustFollow: true,         // Must follow suit if possible
    dunkIsTrump: true,        // Dunk cards are trump
    handSize: 13,             // Cards per hand
    maxBid: 200,              // Highest possible bid
    minBid: 70                // Lowest possible bid
  },
  phase: "bidding",           // Current game phase: "bidding" | "kitty" | "power-suit" | "play"
  score: { team0: 0, team1: 0 }, // Current scores
  history: {                  // What's happened so far
    bids: [],                 // Bidding history
    tricks: []                // Completed tricks
  },
  deck: {                     // Card information
    ranks: ["1", "14", "13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "D"],
    suits: ["yellow", "orange", "green", "blue", "dunk"],
    dunk: { suit: "dunk", rank: "dunk" }
  }
};

// Plus these for each decision:
const hand = [/* your cards */];           // Your current hand
const legalCards = [/* playable cards */]; // Cards you can legally play
const trick = {                            // Current trick state
  leadSuit: "orange",                      // Suit led
  cards: [{seat: 0, card: {suit: "orange", rank: "14"}}], // Cards played
  trump: "spades"                          // Current trump suit
};
```

## Main AI Class

This is the main interface that the game engine will use:

```javascript
export class AIPlayer {
  constructor(name = "Bot", config = {}) {
    this.name = name;
    this.cfg = withDefaults(config);  // Apply default settings
    this.memory = new Memory();       // Remember what opponents do
  }

  // Called during bidding phase
  chooseBid(hand, ctx) {
    return Bidding.chooseBid(hand, ctx, this.cfg, this.memory);
  }

  // Called when you win the bid and need to pick trump
  chooseTrump(hand, ctx) {
    return Trump.chooseTrump(hand, ctx, this.cfg, this.memory);
  }

  // Called when it's your turn to play a card
  choosePlay(hand, legalCards, trick, ctx) {
    return Play.chooseCard(hand, legalCards, trick, ctx, this.cfg, this.memory);
  }
}
```

## Config and Weights (Easy to Tune)

These settings control how the AI behaves. You can change them without touching code:

```javascript
const DEFAULTS = {
  weights: {
    highCard: 6,        // How much to value high cards (A, K, Q)
    dunkCard: 12,       // How much to value Dunk cards
    suitLen: 1.5,       // Bonus for having many cards of same suit
    voidBonus: 4,       // Bonus for not having a suit (good for trumping)
    trumpLen: 2.5,      // Bonus for trump cards
    controlCard: 3,     // Bonus for having highest card of a suit
    partnerLeadBonus: 1.5 // Bonus when partner is leading
  },
  rollout: { 
    enabled: false,     // Advanced simulation (turn on later)
    samples: 120,       // How many simulations to run
    depth: 6,           // How far ahead to look
    timeMs: 45          // Time limit for thinking
  },
  aggression: 1.0,      // Bidding style: 0.5 = conservative, 1.5 = aggressive
};

function withDefaults(config) {
  return { 
    ...DEFAULTS, 
    ...config, 
    weights: { ...DEFAULTS.weights, ...(config.weights || {}) } 
  };
}
```

## Helper Functions (Small, Reusable Tools)

These are simple functions that help with common tasks:

```javascript
// Convert a card to a number for sorting (higher = better)
function cardSortKey(card, trump, ranksOrder) {
  const isTrump = card.suit === trump || card.suit === "dunk";
  const rankIdx = ranksOrder.indexOf(card.rank);
  const trumpBias = isTrump ? 100 : 0;  // Trump cards are always higher
  return trumpBias + rankIdx;
}

// Check if you can legally follow suit
function isLegalFollow(legalCards, suitRequired) {
  if (!suitRequired) return true;
  return legalCards.some(c => c.suit === suitRequired || c.suit === "dunk");
}

// Count how many cards you have of each suit
function countBySuit(hand) {
  const map = {};
  for (const c of hand) map[c.suit] = (map[c.suit] || 0) + 1;
  return map;
}

// Check if you have any cards of a specific suit
function hasSuit(hand, suit) {
  return hand.some(c => c.suit === suit);
}

// Check if this is the highest card of its suit in your hand
function isControlCard(card, hand, trump, ranksOrder) {
  if (card.suit === "dunk") return true;  // Dunk is always control
  const higherInHand = hand.some(
    c => c.suit === card.suit && 
         cardSortKey(c, trump, ranksOrder) > cardSortKey(card, trump, ranksOrder)
  );
  return !higherInHand;  // No higher card found = this is control
}
```

## Hand Strength Evaluator

This calculates how good your hand is for bidding and trump selection:

```javascript
const Eval = {
  // Calculate overall hand strength
  handStrength(hand, trumpGuess, ranksOrder, W) {
    let score = 0;
    const bySuit = countBySuit(hand);

    // Score each card
    for (const c of hand) {
      // High cards (top 3 ranks)
      const highRank = ranksOrder.indexOf(c.rank) >= ranksOrder.length - 3;
      if (highRank) score += W.highCard;

      // Special cards
      if (c.suit === "dunk") score += W.dunkCard;
      if (c.suit === trumpGuess) score += W.trumpLen;
      if (isControlCard(c, hand, trumpGuess, ranksOrder)) score += W.controlCard;
    }

    // Suit distribution bonuses
    for (const suit in bySuit) {
      const len = bySuit[suit];
      score += len * W.suitLen;  // Longer suits are better
      if (len === 0) score += W.voidBonus;  // Voids are good for trumping
    }

    return score;
  },

  // Find the best trump suit for your hand
  bestTrumpSuit(hand, suits, ranksOrder, W) {
    let best = { suit: suits[0], score: -Infinity };
    for (const s of suits) {
      const sc = Eval.handStrength(hand, s, ranksOrder, W);
      if (sc > best.score) best = { suit: s, score: sc };
    }
    return best.suit;
  }
};
```

## Bidding Logic

How the AI decides how much to bid:

```javascript
const Bidding = {
  chooseBid(hand, ctx, cfg, memory) {
    const W = cfg.weights;
    const ranks = ctx.deck.ranks;
    const suits = ctx.deck.suits.filter(s => s !== "dunk");

    // Figure out best trump and hand strength
    const trumpGuess = Eval.bestTrumpSuit(hand, suits, ranks, W);
    const strength = Eval.handStrength(hand, trumpGuess, ranks, W);

    // Convert strength to a bid amount
    let base = Math.round(60 + strength * 4 * cfg.aggression);

    // Check what we need to beat
    const lastBid = getLastNonPass(ctx.history.bids);
    const minToBeat = lastBid ? lastBid.amount + 5 : ctx.rules.minBid;

    // Add pressure if opponents are bidding aggressively
    const pressure = biddingPressure(ctx.history.bids, ctx.seat);
    base += Math.floor(pressure * 5);

    const bid = Math.max(minToBeat, base);
    const cap = ctx.rules.maxBid;

    // Pass if our hand is too weak
    if (base < minToBeat) return "pass";
    return Math.min(bid, cap);
  }
};

// Helper: find the last actual bid (not a pass)
function getLastNonPass(bids) {
  for (let i = bids.length - 1; i >= 0; i--) {
    const b = bids[i];
    if (b && b.action !== "pass") return b;
  }
  return null;
}

// Helper: calculate bidding pressure
function biddingPressure(bids, seat) {
  // More opponent bids than partner bids = more pressure
  let opp = 0, partner = 0;
  for (const b of bids) {
    if (!b || b.action === "pass") continue;
    const sameTeam = (b.seat % 2) === (seat % 2);
    if (sameTeam) partner++; else opp++;
  }
  return Math.max(0, opp - partner) * 0.2;
}
```

## Trump Choice

Simple: pick the suit that makes your hand strongest:

```javascript
const Trump = {
  chooseTrump(hand, ctx, cfg, memory) {
    const ranks = ctx.deck.ranks;
    const suits = ctx.deck.suits.filter(s => s !== "dunk");
    return Eval.bestTrumpSuit(hand, suits, ranks, cfg.weights);
  }
};
```

## Card Play Logic

This is the most complex part. The AI follows these rules:

1. **If leading:** Lead your strongest suit or trump
2. **If partner is winning:** Play low to conserve cards
3. **If you can win cheaply:** Do it
4. **If you can't follow suit:** Trump low or throw junk

```javascript
const Play = {
  chooseCard(hand, legal, trick, ctx, cfg, memory) {
    const ranks = ctx.deck.ranks;
    const trump = trick.trump;

    // Leading the trick
    if (trick.cards.length === 0) {
      return leadStrategy(hand, legal, trump, ranks, cfg, memory);
    }

    // Following to a trick
    const winning = currentWinner(trick, trump, ranks);
    const partnerSeat = (ctx.seat + 2) % ctx.players;
    const partnerIsWinning = winning && winning.seat === partnerSeat;

    // Partner is winning - play low to conserve
    if (partnerIsWinning) {
      const safe = lowestPointPreserving(legal, trump, ranks);
      return safe;
    }

    // Try to win if possible
    const canWin = bestWinningCard(legal, trick, trump, ranks);
    if (canWin) return canWin;

    // Can't win - throw lowest card
    return cheapestThrow(legal, trump, ranks);
  }
};

// Strategy for leading a trick
function leadStrategy(hand, legal, trump, ranks, cfg, memory) {
  const sorted = [...legal].sort((a, b) => cardSortKey(b, trump, ranks) - cardSortKey(a, trump, ranks));
  const bySuit = countBySuit(hand);

  // Prefer leading top card of your longest suit
  const longSuit = Object.entries(bySuit).sort((a, b) => b[1] - a[1])[0]?.[0];
  const candidate = sorted.find(c => c.suit === longSuit && isControlCard(c, hand, trump, ranks));
  if (candidate) return candidate;

  // Or lead trump
  const trumpLead = sorted.find(c => c.suit === trump || c.suit === "dunk");
  if (trumpLead) return trumpLead;

  // Or just highest card
  return sorted[0];
}

// Find who's currently winning the trick
function currentWinner(trick, trump, ranks) {
  if (trick.cards.length === 0) return null;
  const leadSuit = trick.cards[0].card.suit === "dunk" ? trump : trick.cards[0].card.suit;
  let best = trick.cards[0];
  for (const play of trick.cards.slice(1)) {
    const a = best.card, b = play.card;
    const aKey = winningKey(a, leadSuit, trump, ranks);
    const bKey = winningKey(b, leadSuit, trump, ranks);
    if (bKey > aKey) best = play;
  }
  return best;
}

// Calculate how strong a card is in the current trick
function winningKey(card, leadSuit, trump, ranks) {
  const follows = (card.suit === leadSuit) || (card.suit === "dunk" && leadSuit === trump);
  const isTrump = (card.suit === trump) || card.suit === "dunk";
  const base = ranks.indexOf(card.rank);
  if (isTrump && follows) return 300 + base;  // Trump following suit
  if (isTrump) return 200 + base;             // Trump not following
  if (follows) return 100 + base;             // Following suit
  return base;                                // Not following
}

// Find the cheapest card that can win the trick
function bestWinningCard(legal, trick, trump, ranks) {
  const leadSuit = trick.cards[0].card.suit === "dunk" ? trump : trick.cards[0].card.suit;
  const beats = [];
  const current = currentWinner(trick, trump, ranks);
  if (!current) return null;

  // Test each legal card to see if it wins
  for (const c of legal) {
    const hypothetic = { cards: [...trick.cards, { seat: -1, card: c }], trump };
    const winner = currentWinner(hypothetic, trump, ranks);
    if (winner && winner.seat === -1) beats.push(c);
  }
  if (beats.length === 0) return null;
  
  // Play the cheapest winning card
  beats.sort((a, b) => cardSortKey(a, trump, ranks) - cardSortKey(b, trump, ranks));
  return beats[0];
}

// Find the lowest card that preserves partner's lead
function lowestPointPreserving(legal, trump, ranks) {
  const sorted = [...legal].sort((a, b) => cardSortKey(a, trump, ranks) - cardSortKey(b, trump, ranks));
  return sorted[0];
}

// Find the cheapest card to throw away
function cheapestThrow(legal, trump, ranks) {
  // Prefer non-trump cards
  const nonTrump = legal.filter(c => c.suit !== trump && c.suit !== "dunk");
  if (nonTrump.length) {
    nonTrump.sort((a, b) => cardSortKey(a, trump, ranks) - cardSortKey(b, trump, ranks));
    return nonTrump[0];
  }
  // If only trump available, play lowest
  const sorted = [...legal].sort((a, b) => cardSortKey(a, trump, ranks) - cardSortKey(b, trump, ranks));
  return sorted[0];
}
```

## Memory System (Optional Enhancement)

Track what opponents likely have based on what they play:

```javascript
class Memory {
  constructor() {
    this.cannotFollow = new Map();  // Who can't follow which suits
    this.trumpCountShown = 0;       // How many trump cards have been played
  }
}

// Update memory when a card is played
function onCardSeen(memory, play, leadSuit, trump) {
  const s = play.seat;
  const c = play.card;
  
  // Count trump cards played
  if (c.suit === trump || c.suit === "dunk") memory.trumpCountShown++;

  // Track who can't follow suit
  if (leadSuit && c.suit !== leadSuit && c.suit !== "dunk") {
    const set = memory.cannotFollow.get(s) || new Set();
    set.add(leadSuit);
    memory.cannotFollow.set(s, set);
  }
}
```

## Implementation Roadmap

### Phase 1: Basic Implementation
1. Start with hand strength evaluation
2. Add basic card play logic (no bidding yet)
3. Test with simple scenarios

### Phase 2: Add Bidding
1. Implement bidding logic
2. Add trump selection
3. Test full game flow

### Phase 3: Enhancements
1. Add memory system
2. Fine-tune weights based on testing
3. Add rollout simulation (advanced)

## Testing Strategy

### Unit Tests
- Test each helper function with known inputs
- Test hand strength on specific hands
- Verify no illegal moves are generated

### Integration Tests
- Play full games with seeded random numbers
- Compare AI performance against random play
- Log AI decisions for analysis

### Debugging
- Log the top 3 card choices with scores
- Show hand strength calculations
- Track bidding decisions

## How to Improve the AI

### Easy Improvements
1. **Adjust weights** - Change the numbers in the config to make AI more/less aggressive
2. **Add new factors** - Consider card counting, opponent modeling
3. **Tune bidding formula** - Adjust the strength-to-bid conversion

### Advanced Improvements
1. **Rollout simulation** - Simulate future tricks to make better decisions
2. **Opponent modeling** - Remember how each opponent plays
3. **Partnership signaling** - Coordinate with partner through play

### Performance Tuning
1. **Speed vs accuracy** - Balance thinking time with decision quality
2. **Memory usage** - Track only essential information
3. **Deterministic behavior** - Use seeded random numbers for testing

## Integration Checklist

Before implementing, ensure your game engine:
- [ ] Provides `legalCards` so AI never makes illegal moves
- [ ] Calls AI methods with consistent `ctx` object
- [ ] Uses deterministic random numbers for testing
- [ ] Keeps AI separate from game logic (no DOM access)

## Questions for You

1. **Scoring system** - How does your game score? This affects bidding strategy.
2. **Game rules** - Are there special rules for Dunk cards beyond being trump?
3. **AI difficulty** - Do you want multiple AI personalities (easy/medium/hard)?
4. **Performance** - How fast do decisions need to be made?

## Next Steps

1. **Start simple** - Implement just the card play logic first
2. **Test thoroughly** - Play many games to see how it performs
3. **Iterate** - Adjust weights and strategies based on results
4. **Document** - Keep notes on what works and what doesn't

This AI system is designed to be both powerful and understandable. You can start with the basics and add complexity as needed!
