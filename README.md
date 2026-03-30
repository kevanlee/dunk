# DUNK (React + Vite Vertical Slice)

A mobile-first Kentucky Rook web app with a bold arcade presentation and a clean React architecture.

> `main` is a modern rebuild. The older implementation remains preserved on `legacy-version` and is not used by this app.

## Stack

- React 18
- Vite 5
- LocalStorage persistence

## Vertical Slice Included

1. **Main Menu**
   - House Rules details and start flow
   - Future modes roadmap list
   - Local save reset
2. **Table Screen**
   - Mobile-first table layout and hand preview
   - Bid form with House Rules validation (80-200, increments of 5)
   - CPU bidding sequence
   - Round resolution + score moment banner
3. **Stats + Achievements**
   - Persisted placeholder counters
   - Placeholder achievement track

## House Rules (default)

- Rook is always trump
- Kitty is in play
- Minimum bid is **80**
- No forced trump when void in led suit
- 1s = 15
- 14s = 10
- 10s = 10
- 5s = 5
- Rook = 20
- Final trick = 20
- 200 total points per round
- Rook ranks as **10.5** of trump
- First team to **500** wins

## Project Structure

```txt
.
├── index.html
├── package.json
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── components
│   │   └── BottomNav.jsx
│   ├── core
│   │   ├── game
│   │   │   ├── deck.js
│   │   │   ├── roundSimulator.js
│   │   │   ├── scoring.js
│   │   │   ├── state.js
│   │   │   └── trick.js
│   │   └── rulesets
│   │       └── houseRules.js
│   ├── features
│   │   ├── menu/MainMenu.jsx
│   │   ├── stats/StatsScreen.jsx
│   │   └── table/TableScreen.jsx
│   └── services/storage.js
└── vite.config.js
```

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Architecture Notes

- `src/features/*` isolates each screen so later mode-specific UI can branch cleanly.
- `src/core/rulesets` centralizes configurable rules.
- `src/core/game/trick.js` contains card comparison and trick-winner logic.
- `src/core/game/roundSimulator.js` performs full 13-trick simulated round scoring for the vertical slice.
- `src/services/storage.js` isolates local persistence for future migration/versioning.

## Next Steps

- Replace simulated play with interactive trick-by-trick human + AI play.
- Add declarer kitty decision UI and explicit trump selection.
- Add full match records, player profiles, unlockables, and achievements.
- Add richer animation/audio moments for bids, tricks, and round-end events.
