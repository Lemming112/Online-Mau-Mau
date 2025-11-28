# Game-Klasse Dokumentation

Die `Game`-Klasse kapselt die Spiel-Logik für ein Mau-Mau-ähnliches Kartenspiel.  
Sie verwaltet Spieler, Karten, Spielregeln und den aktuellen Spielstatus.

---

## Übersicht

- **Datei:** `game.js`
- **Abhängigkeiten:**  
  - `buildDeck()` → erstellt vollständiges Kartendeck  
  - `shuffle(deck)` → mischt Karten  

---

## Attribute

- `players: string[]`  
  Liste der Spieler-IDs in Zugreihenfolge.

- `hands: Map<string, Card[]>`  
  Zuordnung Spieler → Handkarten.

- `deck: Card[]`  
  Ziehstapel.

- `discard: Card[]`  
  Ablagestapel.

- `turn: number`  
  Index des aktuellen Spielers.

- `started: boolean`  
  Status, ob Spiel läuft.

- `pendingDraw: number`  
  Anzahl Karten, die der nächste Spieler ziehen muss (z. B. durch „7“).

- `requestSuit: string | null`  
  Gewünschte Farbe nach „J“ (Jack).

---

## Methoden

### `start(playerIds: string[])`
Initialisiert ein neues Spiel.  
- Spieler werden gesetzt.  
- Deck wird erstellt und gemischt.  
- Jeder Spieler erhält 5 Karten.  
- Erste Karte wird auf Ablagestapel gelegt.  
- Zug beginnt bei Spieler 0.  
- Statusvariablen zurückgesetzt.

---

### `currentPlayer(): string`
Gibt die Spieler-ID des aktuellen Spielers zurück.

---

### `draw(playerId: string): Card | null`
Spieler zieht Karten.  
- Nur erlaubt, wenn Spiel läuft und Spieler am Zug ist.  
- Anzahl Karten = `pendingDraw` oder mindestens 1.  
- Karten werden der Hand hinzugefügt.  
- `pendingDraw` wird zurückgesetzt.  
- Zug wechselt zum nächsten Spieler.  
- Rückgabe: letzte gezogene Karte.

---

### `play(playerId: string, card: Card): boolean`
Spieler spielt eine Karte.  
- Prüft, ob Spieler am Zug ist und Karte in Hand existiert.  
- Prüft Legalität: gleiche **Rank**, gleiche **Suit**, oder **J** (Jack), oder gewünschte Farbe (`requestSuit`).  
- Wendet Spezialregeln an:
  - **7** → nächster Spieler muss 2 Karten ziehen (stapelbar).  
  - **8** → nächster Spieler wird übersprungen.  
  - **J** → Wunschfarbe (hier nur Platzhalter).  
- Entfernt Karte aus Hand, legt sie auf Ablagestapel.  
- Falls Hand leer → Spiel beendet (`started = false`).  
- Sonst → Zugwechsel.  
- Rückgabe: `true` bei gültigem Zug, sonst `false`.

---

### `reshuffle()`
Mischt Ablagestapel neu, wenn Ziehstapel leer ist.  
- Oberste Karte bleibt auf Ablagestapel.  
- Rest wird neu gemischt und als Ziehstapel gesetzt.

---

### `advanceTurn()`
Wechselt zum nächsten Spieler (`turn` + 1, modulo Anzahl Spieler).

---

### `state(): object`
Gibt aktuellen Spielstatus zurück:  
- `started` → Spiel läuft oder beendet  
- `players` → Liste der Spieler  
- `turn` → Index des aktuellen Spielers  
- `top` → oberste Karte auf Ablagestapel  
- `counts` → Kartenanzahl pro Spieler  
- `pendingDraw` → Anzahl zu ziehender Karten  
- `requestSuit` → gewünschte Farbe (falls gesetzt)

---

## Beispielablauf

1. `start(["p1", "p2"])` → Spiel beginnt, Karten verteilt.  
2. Spieler `p1` spielt eine Karte mit `play("p1", card)`.  
3. Spieler `p2` muss ggf. Karten ziehen mit `draw("p2")`.  
4. Spezialregeln (7, 8, J) werden angewendet.  
5. `state()` liefert jederzeit den aktuellen Status.  
6. Wenn ein Spieler keine Karten mehr hat → Spiel endet.

---

## Hinweise

- Spiel endet automatisch, wenn ein Spieler keine Karten mehr hat.  
- Wunschfarbe nach „J“ ist vorbereitet, aber noch nicht vollständig implementiert.  
- Kartenobjekte haben Struktur `{ rank: string, suit: string }`.  