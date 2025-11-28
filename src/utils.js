/* Builds a standard deck of 32 playing cards */
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

/* Creates a player deck (dummy implementation) */
export function create_player_deck() {
  const player_deck = [7];
  const temp_deck = buildDeck();
  for(let i=0;i<7;i++) {
    console.log("Creating player deck...");
    player_deck[i] = temp_deck.pop(i);
  }
  return player_deck;
}

/* Shuffles an array using the Fisher-Yates algorithm */
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
