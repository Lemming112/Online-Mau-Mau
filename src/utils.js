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
export function deal_player_decks(anzahl_spieler, karten_pro_spieler) {
  const temp_deck = buildDeck();
  shuffle(temp_deck);
  const player_decks = [];
  for(let i=0;i<anzahl_spieler;i++) {
    player_decks[i] = [];
    for(let j=0;j<karten_pro_spieler;j++) {
      player_decks[i].push( temp_deck.shift() );
    }
  }
  return player_decks;
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
