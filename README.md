# Kentucky Rook (Web App)

A fast, mobile-first trick-taking card game inspired by classic Rook, rebuilt with a modern interface and expanded game modes.

This project starts with a clean implementation of **Kentucky Rook (House Rules)** and evolves into a deeper game experience with unlocks, stats, and multiple play styles.

---

## 🃏 What is Kentucky Rook?

Kentucky Rook is a trick-taking partnership game played with a Rook deck. Players bid on how many points they believe they can win in a round, declare trump, and compete to capture scoring cards.

This version emphasizes:
- fast play
- clear visual feedback
- mobile-first design
- minimal UI friction

---

## 🎯 Core Gameplay Loop

Each round follows four phases:

1. **Bidding**  
   Players bid on how many points they can capture.

2. **Trump Selection**  
   Winning bidder selects the trump color.

3. **Trick Play**  
   Players play cards one at a time, following suit if possible.

4. **Scoring**  
   Points are counted, contract is evaluated, and scores update.

---

## 🏠 House Rules (Primary Mode)

This is the default ruleset for the game.

### Scoring
- 1s = 15 points  
- 14s = 10 points  
- 10s = 10 points  
- 5s = 5 points  
- Rook = 20 points  
- Final trick = 20 points  
- Total per round = **200 points**

---

### Card Ranking
- In each suit:  
  **1 is the highest card**

- Ranking (high → low):  
  `1, 14, 13, 12, ... 2`

- **Rook**
  - Always part of the trump suit  
  - Ranks between trump 10 and trump 11  

---

### Bidding
- Minimum bid: 80  
- Players bid in increments (e.g. +5)  
- Highest bidder:
  - wins the contract  
  - selects trump  

---

### Teams (4-player)
- 2 vs 2 partnerships  
- Standard seating (you + teammate vs opponents)

---

### Scoring Outcome
- If bidding team meets or exceeds bid → score points earned  
- If bidding team fails → **set** (lose points equal to bid)  

---

### Win Condition
- First team to **500 points** (configurable)

---

## 👥 5-Player Variant (Planned)

A key variation we want to support.

### Key Differences
- Solo bidder selects a **hidden partner card**
- Partner is revealed when that card is played
- Optional mechanic:
  - bidder can “ask partner to lead”

This mode adds:
- hidden information  
- dramatic mid-round reveal  
- more social gameplay dynamics  

---

## 🎮 Additional Rule Variants (Planned)

We aim to support multiple play styles:

### Classic Rook
- More traditional scoring and ranking
- Optional fixed trump

### Casual Mode
- Simplified bidding
- Faster rounds
- Reduced penalties

### Custom Rules
- Adjustable:
  - point values  
  - winning score  
  - bid minimum  
  - trump behavior  

---

## 🎨 Design Philosophy

This game is built around:

- **Clarity over decoration**
- **Mobile-first layout**
- **Fast interaction (tap → result)**
- **Visual understanding over text explanation**

Early versions intentionally use:
- minimal colors (white/gray/black)
- simple card design
- reduced UI noise

---

## 🚀 Planned Features

### 🧠 Gameplay Enhancements
- Smarter AI (multiple difficulty levels)
- Better bidding logic
- Partner signaling (advanced play)

---

### 📊 Stats & Records
- Lifetime stats:
  - win/loss
  - average bid success
  - points per round
- Match history
- Personal bests

---

### 🏆 Achievements & Unlocks
- Unlockable:
  - card backs
  - table styles
  - player avatars
- Achievements:
  - “Perfect Round” (200 pts)
  - “Clutch Bid”
  - “Set Opponent”

---

### 🎨 Visual Style Evolution
Inspired by arcade energy (e.g. NBA Jam):

- punchy animations
- satisfying trick wins
- celebratory scoring moments

---

### 🌐 Multiplayer (Future)
- Local pass-and-play
- Online multiplayer
- Private games with friends

---

## 🧪 Development Approach

This project is built iteratively:

1. Get a **fully playable loop**
2. Remove friction and confusion
3. Improve clarity and speed
4. Layer in depth (AI, modes, unlocks)

---

## 📦 Tech

- HTML / CSS / JavaScript (no frameworks)
- Runs directly in the browser
- Built for rapid iteration and playtesting

---

## 🧭 Vision

The goal is to create:

> The best digital version of Rook — fast, clear, and genuinely fun to play repeatedly.

Not just a rules simulation, but a game that feels:
- responsive
- readable
- satisfying