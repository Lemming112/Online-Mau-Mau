# Mau Mau Online (Railway-ready)

Ein minimaler WebSocket-Server plus statischer Client für Mau Mau. Ziel: schnelles Coop-Setup über Railway.

## Features
- Mehrspieler über WebSocket (Rooms)
- Basisregeln: 7(+2), 8(skip), J(Wunschfarbe – Platzhalter)
- Einfache UI (Demo): Beitreten, Starten, Ziehen, Spielen
- Docker-Deploy auf Railway

## Lokale Nutzung
1. Node 18+ installieren
2. `npm install`
3. `npm run dev`
4. Browser: `http://localhost:3000`

## Deployment auf Railway
1. Repo auf GitHub pushen
2. Auf Railway ein neues Projekt erstellen und mit dem Repo verbinden
3. Railway erkennt das `Dockerfile` und baut automatisch
4. Nach Deploy: App-URL öffnen und mit Freunden spielen

## Umgebungsvariablen
- `ORIGIN`: CORS-Erlaubnis (z. B. deine Railway-Domain)
- `PORT`: von Railway gesetzt (lokal 3000)

## Dateien
Spielverzeichnis mit den Regeln ist in 'src/game.js' zu finden

## Nächste Schritte
- Echte Hand-Karten pro Spieler im Client anzeigen (nicht nur Platzhalter)
- Wunschfarbe nach J implementieren (Client-Dialog -> Server)
- Persistente Räume / einfache Auth
- Regeln/Varianten konfigurierbar machen
