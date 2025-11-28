# Client-Skript Dokumentation

Dieses Skript stellt die Client-Logik für ein Multiplayer-Kartenspiel bereit.  
Es verbindet sich per **WebSocket** mit dem Server, verwaltet die Benutzeroberfläche und verarbeitet Nachrichten.

Die Datei 'client.js ' liegt in 'src/client.js'

---

## Übersicht

- **Datei:** `client.js`
- **Abhängigkeiten:** DOM-Elemente (`joinBtn`, `startBtn`, `drawBtn`, `players`, `top`, `turn`, `hand`, `log`)
- **Kommunikation:** WebSocket-Nachrichten (`join`, `start`, `draw`, `play`)

---

## Globale Variablen

- `ws`: WebSocket-Verbindung
- `roomId`: Raum-ID (vom Server vergeben)
- `playerId`: Spieler-ID (vom Server vergeben)

---

## Buttons und Events

### `joinBtn.onclick`
- Liest `room` und `name` aus Eingabefeldern.
- Baut WebSocket-Verbindung (`getWsUrl()`).
- Sendet `join`-Nachricht an den Server.
- Registriert Event-Handler:
  - `onopen`: Verbindung hergestellt
  - `onmessage`: Nachrichtenverarbeitung (`handle`)
  - `onclose`: Verbindung geschlossen
  - `onerror`: Fehlerbehandlung

---

### `startBtn.onclick`
- Sendet `start`-Nachricht mit `roomId`.
- Nur aktiv, wenn Spieler erfolgreich beigetreten ist.

---

### `drawBtn.onclick`
- Sendet `draw`-Nachricht mit `roomId`.
- Aktiviert nach `renderState`.

---

## Nachrichtenverarbeitung

### `handle(msg)`
Switch-Case für Nachrichtentypen:

- `hello`: Loggt Begrüßung
- `joined`: Speichert `roomId` und `playerId`, aktiviert `startBtn`
- `players`: Ruft `renderPlayers` auf
- `state`: Ruft `renderState` auf
- `play_ok`: Loggt gespielte Karte
- `play_fail`: Loggt ungültigen Zug
- `drawn`: Loggt gezogene Karte
- `error`: Loggt Fehlermeldung
- `default`: Loggt unbekannte Nachricht

---

## Rendering-Funktionen

### `renderPlayers(players)`
- Zeigt aktuelle Spieler-Liste im DOM (`players`).

### `renderState(state)`
- Zeigt Ablagestapel (`top`) und aktuellen Spieler (`turn`).
- Baut Dummy-Handkarten als Buttons:
  - Ränge: `7, 8, 9, 10, J, Q, K, A`
  - Farben: `♠, ♥, ♦, ♣`
- Jeder Button sendet `play`-Nachricht mit Karte.
- Aktiviert `drawBtn`.

---

## Hilfsfunktionen

### `getWsUrl()`
- Wählt Protokoll (`ws` oder `wss`) abhängig von `location.protocol`.
- Baut URL: `${proto}://${location.host}`.

### `log(t)`
- Fügt Textzeile ins Log-DOM-Element ein.

### `fmtCard(c)`
- Formatiert Karte als String: `rank + suit`.

---

## Beispielablauf

1. Spieler klickt **Join** → Verbindung wird aufgebaut, `join` gesendet.
2. Server antwortet mit `joined` → `roomId` und `playerId` gespeichert.
3. Spieler klickt **Start** → `start` gesendet, Spiel beginnt.
4. Spieler klickt Karte → `play` gesendet.
5. Spieler klickt **Draw** → `draw` gesendet.
6. Server broadcastet Status → `renderState` aktualisiert UI.

---

## Hinweise

- Buttons für Karten sind **Dummy-Daten** (Demo).  
- Echte Handkarten sollten vom Server geliefert werden.  
- Fehler werden im Log angezeigt (`⚠️ Fehler`).