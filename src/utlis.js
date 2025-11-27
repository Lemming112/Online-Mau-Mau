export function buildDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck = [];
  for (const s of suits) {
    for (const r of ranks) {
      deck.push({ suit: s, rank: r });
    }
  }
  return deck;
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
