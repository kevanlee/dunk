const SUITS = ['Red', 'Green', 'Yellow', 'Black'];

function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 14; rank += 1) {
      deck.push({ id: `${suit}-${rank}`, suit, rank, label: `${rank}` });
    }
  }
  deck.push({ id: 'ROOK', suit: 'Rook', rank: 10.5, label: 'ROOK' });
  return deck;
}

function shuffle(cards) {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function dealRound() {
  const shuffled = shuffle(createDeck());
  const players = [[], [], [], []];

  for (let i = 0; i < 52; i += 1) {
    players[i % 4].push(shuffled[i]);
  }

  const kitty = shuffled.slice(52, 57);

  return {
    hands: players,
    kitty,
  };
}
