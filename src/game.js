import { buildDeck, shuffle } from "./utils.js";

export class Game {
  constructor() {
    this.players = []; // array of playerIds in turn order
    this.hands = new Map(); // playerId -> array of cards
    this.deck = [];
    this.discard = [];
    this.turn = 0;
    this.started = false;
    this.pendingDraw = 0; // for 7 chain, etc.
    this.requestSuit = null; // for Jack wish (Ass in Mau Mau-Varianten -> hier Jack)
  }

  start(playerIds) {
    this.players = playerIds.slice();
    this.deck = shuffle(buildDeck());
    this.discard = [];
    this.hands.clear();
    for (const p of this.players) {
      this.hands.set(p, this.deck.splice(0, 5));
    }
    // Flip first card to discard
    this.discard.push(this.deck.shift());
    this.turn = 0;
    this.started = true;
    this.pendingDraw = 0;
    this.requestSuit = null;
  }

  currentPlayer() {
    return this.players[this.turn % this.players.length];
  }

  draw(playerId) {
    if (!this.started || playerId !== this.currentPlayer()) return null;
    const count = Math.max(1, this.pendingDraw);
    const cards = this.deck.splice(0, count);
    if (cards.length < count) this.reshuffle();
    this.hands.get(playerId).push(...cards);
    this.pendingDraw = 0;
    this.advanceTurn();
    return cards.at(-1) ?? null;
  }

  play(playerId, card) {
    if (!this.started || playerId !== this.currentPlayer()) return false;
    const hand = this.hands.get(playerId);
    const idx = hand.findIndex((c) => c.rank === card.rank && c.suit === card.suit);
    if (idx === -1) return false;

    const top = this.discard.at(-1);
    const legal =
      card.rank === top.rank ||
      card.suit === top.suit ||
      (card.rank === "J") || // Jack: Wunschfarbe
      (this.requestSuit && card.suit === this.requestSuit);

    if (!legal) return false;

    // Apply special rules (basic Mau Mau):
    // 7 -> next player draws 2 (stackable)
    // 8 -> skip next player
    // J -> wish suit (handled client-side with extra message; here we accept and clear)
    hand.splice(idx, 1);
    this.discard.push(card);

    if (card.rank === "7") this.pendingDraw += 2;
    if (card.rank === "8") this.advanceTurn(); // skip one extra

    // If Jack was played, client should send desired suit; we reset placeholder here.
    if (card.rank === "J") {
      // requestSuit will be set by separate message in an extended version
      this.requestSuit = null;
    } else {
      this.requestSuit = null;
    }

    if (hand.length === 0) {
      this.started = false; // game over
    } else {
      this.advanceTurn();
    }
    return true;
  }

  reshuffle() {
    const top = this.discard.pop();
    this.deck = shuffle(this.discard);
    this.discard = [top];
  }

  advanceTurn() {
    this.turn = (this.turn + 1) % this.players.length;
  }

  state() {
    return {
      started: this.started,
      players: this.players,
      turn: this.turn,
      top: this.discard.at(-1),
      counts: Object.fromEntries(
        Array.from(this.hands.entries()).map(([p, h]) => [p, h.length])
      ),
      pendingDraw: this.pendingDraw,
      requestSuit: this.requestSuit,
    };
  }
}
