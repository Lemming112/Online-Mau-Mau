# Lobby-Klasse -- Dokumentation

Die `Lobby`-Klasse verwaltet Spielräume (Rooms), Spieler und deren
WebSocket-Verbindungen. Sie ist verantwortlich für das Erstellen,
Betreten, Verlassen und Verwalten von Räumen sowie für die Kommunikation
mit den verbundenen Clients.

## Inhalt

-   Überblick
-   Struktur der Lobby
-   Methoden
-   Hilfsfunktion: safeSend
-   Events & Nachrichtenstruktur

## Überblick

Die Lobby dient als zentrale Verwaltungsschicht zwischen
WebSocket-Verbindungen und dem eigentlichen Spielobjekt.

## Struktur der Lobby

`rooms`: Map von Raum-ID zu Raumdaten\
`wsToRoom`: Map von WebSocket zu Raum-ID

## Methoden

### constructor()

Initialisiert Datenstrukturen.

### join(ws, roomId, name)

Fügt einen Spieler hinzu, erstellt ggf. einen neuen Raum, sendet
Statusupdates.

### leave(ws)

Entfernt Spieler aus Raum, löscht Raum wenn leer.

### start(roomId)

Startet das Spiel für alle Spieler im Raum.

### play(roomId, ws, card)

Spieler spielt eine Karte.

### draw(roomId, ws)

Spieler zieht eine Karte.

### sendState(roomId, ws)

Sendet aktuellen Spielstatus.

### broadcast(roomId, message)

Sendet Nachricht an alle Spieler im Raum.

## safeSend

Hilfsfunktion für sicheres WebSocket-Senden.

## Events

-   joined
-   players
-   state
-   play_ok / play_fail
-   drawn
-   error
