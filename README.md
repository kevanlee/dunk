# Kentucky Rook Card Game

python3 -m http.server 2500

A web-based implementation of the classic Kentucky Rook card game, featuring modern UI design and interactive gameplay.

## 🎮 Game Overview

Kentucky Rook is a trick-taking card game that combines elements of Bridge and Hearts. It's played with a special Rook deck (which can be simulated with a standard deck) and involves bidding, trump selection, and strategic play.

## 🃏 Game Rules

### Equipment
- **Rook Deck**: 57 cards (1-14 in four colors: Red, Yellow, Green, Black, plus the Rook Bird card)
- **Alternative**: Use a standard 52-card deck + 1 Joker (Joker becomes the Rook Bird)

### Objective
Score the most points by winning tricks and meeting your bid. The game combines bidding strategy with careful card play.

### Number of Players
- **4 players** (best with 2 teams of 2, sitting across from each other)
- **3 players** (each playing individually)

### Card Values
- **High Trump**: Rook Bird (highest card in the game)
- **Trump Suit**: 1 (Ace) is highest, then 14, 13, 12... down to 2
- **Non-Trump Suits**: 1 (Ace) is highest, then 14, 13, 12... down to 2
- **Rook Bird**: Always the highest card, regardless of trump

### Game Setup

1. **Deal**: Each player receives 13 cards (in 4-player game) or 17 cards (in 3-player game)
2. **Bidding**: Players bid on how many tricks they think they can win
3. **Trump Selection**: Highest bidder chooses the trump suit
4. **Rook Bird**: The Rook Bird card is always the highest card

### Bidding Phase

1. Starting with the dealer's left, each player bids once
2. **Minimum bid**: 70 points
3. **Bid increments**: Usually in multiples of 5 or 10
4. **Passing**: Players can pass if they don't want to bid higher
5. **Highest bidder**: Becomes the declarer and chooses trump

### Trump Selection

The declarer (highest bidder) must:
1. Choose one of the four suits as trump
2. The Rook Bird automatically becomes the highest trump
3. Announce their bid amount to the table

### Playing the Game

#### Trick-Taking Rules
1. **Lead**: Declarer leads the first trick
2. **Follow Suit**: Players must follow the led suit if possible
3. **Trump**: Players can trump if they can't follow suit
4. **Winning**: Highest trump wins, or highest card of led suit if no trump
5. **Rook Bird**: Always wins the trick

#### Scoring System

**Positive Points:**
- **High Trump (Rook Bird)**: 20 points
- **Low Trump (2 of trump suit)**: 20 points
- **Each trick won**: 10 points
- **Total possible**: 180 points (20 + 20 + 14 tricks × 10)

**Bid Bonus:**
- **Making your bid**: +50 points
- **Failing your bid**: -50 points

**Team Scoring (4-player):**
- Add both partners' scores together
- Team with highest total score wins

### Winning Conditions

**4-Player Game:**
- First team to reach 500 points wins
- If both teams reach 500 in same hand, highest score wins

**3-Player Game:**
- First player to reach 500 points wins
- If multiple players reach 500, highest score wins

### Special Rules

1. **Rook Bird**: Always the highest card, can be played at any time
2. **Trump 1 (Ace)**: Second highest card when trump is called
3. **Low Trump (2)**: Worth 20 points, but not automatically highest
4. **Bidding Strategy**: Consider your hand strength and potential tricks
5. **Team Communication**: Partners can signal through card play

### Strategy Tips

1. **Bidding**: Count your sure tricks and estimate potential ones
2. **Trump Selection**: Choose the suit where you have the most high cards
3. **Rook Bird**: Save it for crucial tricks or when you need to win
4. **Team Play**: Coordinate with your partner through card signals
5. **Defense**: Try to prevent opponents from making their bid

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start playing!

### How to Play
1. Click "Start Game" to begin
2. Use WASD or Arrow keys to move your player
3. Avoid enemies and collect power-ups
4. Try to achieve the highest score possible

## 🛠️ Technical Details

### File Structure
```
rook/
├── index.html          # Main HTML file
├── style.css           # Styling and animations
├── README.md           # This file
├── images/             # Image assets
└── js/
    ├── main.js         # Main entry point
    ├── logic.js        # Game logic and state management
    ├── gameplay.js     # Game mechanics and interactions
    └── setup.js        # Initialization and configuration
```

### Technologies Used
- **HTML5**: Structure and canvas element
- **CSS3**: Styling, animations, and responsive design
- **JavaScript**: Game logic, interactivity, and canvas rendering

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

Feel free to contribute to this project by:
1. Reporting bugs
2. Suggesting new features
3. Submitting pull requests
4. Improving documentation

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Traditional Kentucky Rook players and communities
- Card game enthusiasts worldwide
- Open source community for inspiration and tools

---

**Note**: This implementation is a modern web-based version of the classic Kentucky Rook card game. The rules described here are based on traditional gameplay, but variations may exist in different regions and communities.
