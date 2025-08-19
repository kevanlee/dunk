# Dunk — A trick-taking, rim-rattling card game

python3 -m http.server 2500

Fixes and polish: 

* Fix the disabled cards logic or else add error state
* NEW: Add a log to the top left
* NEW: Add funny commentary

## Game Overview

Dunk is a four-person, trick-taking card game inspired by Rook, specifically the variant known as Kentucky Rook. If you've never played Rook before, it's a little like Bridge-meets-Hearts. Dunk is played with a special card deck and involves bidding, power suits, and team play.

## Game Setup

### Equipment
- **Deck of cards**: 57 cards (1-14 in four colors: Gatorade orange, Mellow yellow, Bottled water blue, Baja blast green, plus the Dunk card)

### Objective
Score the most points by winning tricks and meeting your bid. First team to 500 wins.

### Number of Players
- **4 players** (2 teams of 2, sitting across from each other)

### Card Values
- **Power Suit**: 1 is highest, then 14, 13, 12... down to 2
- **Non-Trump Suits**: 1 is highest, then 14, 13, 12... down to 2
- **Dunk Card**: Worth 10.5 in the power suit

### Pre-Game Phases

1. **Deal**: Each player receives 13 cards. The remaining 5 cards are added to the "kitty."
2. **Bidding**: Players bid on how many points they think they can win
3. **Power Suit Selection + Kitty**: Highest bidder chooses the power suit and looks through the kitty. They must return any 5 cards from their hand and/or the kitty back into the kitty.

### Bidding Phase

1. Starting to the dealer's left, players take turns bidding, according to the following rules
2. **Minimum bid**: 70 points
3. **Bid increments**: Must be at least 5 points higher, but can be more
4. **Bid maximium**: Highest bid is 200
5. **Passing**: Players can pass if they don't want to bid higher
6. **Bidding ends**: The bidding ends when someone bids 200 or when three of the four players have passed
7. **Highest bidder**: Becomes the declarer and chooses the power suit and looks through the kitty

### Power suit Selection

The highest bidder must:
1. Choose one of the four suits as power suit
2. The Dunk card automatically becomes 10.5 in the power suit

## Playing the Game

#### Trick-Taking Rules
1. **Lead**: Highest bidder leads the first trick
2. **Follow Suit**: Players must follow the led suit if possible
3. **Power suit**: Players can trump if they can't follow suit
4. **Taking the trick**: Highest trump wins, or highest card of led suit if no trump
5. **Next trick**: The winner of the previous trick leads the next trick

#### Scoring System

**Points:**
- **Dunk card**: 20 points
- **All 1s**: 15 points
- **All 14s and 10s**: 10 points
- **All 5s**: 5 points
- **Taking the final trick**: 20 points
- **Total possible**: 200 points

**Team Scoring (4-player):**
- Add both partners' scores together
- For scoring the team with the highest bidder, see below
- For the other team, their final score is the total of both players' scores
  
**Making or failing the bid:**
For the team with the highest bidder, the following end-of-round scoring rules apply:
- **Making your bid**: Final score is the total of both teammates' scores
- **Failing your bid**: You lose the number of points that you bid

- Scores accumulate from round-to-round

### Winning Conditions

**4-Player Game:**
- First team to reach 500 points wins
- If both teams reach 500 in same hand, highest score wins
- If still tied, the winner of the most recent round wins

## Strategy Tips

1. **Bidding**: Count your sure tricks and estimate potential ones
2. **Trump Selection**: Choose the suit where you have the most high cards
3. **Rook Bird**: Save it for crucial tricks or when you need to win
4. **Team Play**: Coordinate with your partner through card signals
5. **Defense**: Try to prevent opponents from making their bid


## Technical Details

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

### Game Phases
- **WELCOME**: Start screen with game introduction
- **NEW_GAME**: Initialize game state, reset scores (background)
- **NEW_ROUND**: Shuffle deck, deal 13 cards to each player + 5 to kitty (background)
- **DEALING**: Visual animation - sort and display player's cards one by one
- **BIDDING**: Players bid on points they think they can win
- **GAMEPLAY**: 13 tricks are played (one for each card)
- **ROUND_SCORING**: Calculate points for the round, update running scores
- **END**: Game over screen, winner determination (when someone reaches 500 points)

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
