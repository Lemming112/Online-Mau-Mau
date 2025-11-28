# Kartendeck-Modul -- Dokumentation

Dieses Modul enthält zwei Funktionen:

-   `buildDeck()` -- erzeugt ein vollständiges Kartenblatt
-   `shuffle(arr)` -- mischt ein Array per Fisher-Yates-Algorithmus

------------------------------------------------------------------------

## buildDeck()

Erstellt ein Kartendeck bestehend aus **32 Karten**
(Skat-/Schafkopf-Deck).

### Suits (Farben)

-   ♠ Pik\
-   ♥ Herz\
-   ♦ Karo\
-   ♣ Kreuz

### Ranks (Werte)

-   7, 8, 9, 10, J, Q, K, A

### Rückgabewert

Ein Array aus Kartenobjekten:

``` js
[
  { suit: "♠", rank: "7" },
  { suit: "♠", rank: "8" },
  ...,
  { suit: "♣", rank: "A" }
]
```

------------------------------------------------------------------------

## shuffle(arr)

Mischt ein Array mithilfe des **Fisher-Yates-Shuffle**.

### Parameter

  Name    Typ     Beschreibung
  ------- ------- ------------------------
  `arr`   Array   Das zu mischende Array

### Beispiel

``` js
const deck = buildDeck();
const shuffled = shuffle(deck);
console.log(shuffled);
```
