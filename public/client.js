let ws;
let roomId;
let playerId;

/* Buttons */
const joinBtn = document.getElementById("joinBtn");
const startBtn = document.getElementById("startBtn");
const drawBtn = document.getElementById("drawBtn");

/* Verbindet mit dem Server und tritt einem Raum bei */
joinBtn.onclick = () => {
  const room = document.getElementById("room").value.trim();
  const name = document.getElementById("name").value.trim() || "Spieler";

  ws = new WebSocket(getWsUrl());
  ws.onopen = () => {
    log("Verbunden.");
    ws.send(JSON.stringify({ type: "join", roomId: room, name }));
  };
  ws.onmessage = (ev) => handle(JSON.parse(ev.data));
  ws.onclose = () => log("Verbindung geschlossen.");
  ws.onerror = (err) => {
  console.error("WebSocket-Fehler:", err);
  log("WebSocket-Fehler: " + JSON.stringify(err));
};

};

/* Start- und Zieh-Buttons */
startBtn.onclick = () => {
  if (!ws || !roomId) return;
  ws.send(JSON.stringify({ type: "start", roomId }));
};

drawBtn.onclick = () => {
  if (!ws || !roomId) return;
  ws.send(JSON.stringify({ type: "draw", roomId }));
};

/* Verarbeitet eingehende Nachrichten */
function handle(msg) {
  switch (msg.type) {
    case "hello":
      log(msg.payload);
      break;
    case "joined":
      roomId = msg.payload.roomId;   // vom Server übernehmen
      playerId = msg.payload.playerId;
      log(`Raum: ${roomId}, Spieler-ID: ${playerId}`);
      startBtn.disabled = false;     // erst jetzt aktivieren
      break;
    case "players":
      renderPlayers(msg.payload);
      break;
    case "state":
      renderState(msg.payload);
      break;
    case "play_ok":
      log(`Karte gespielt: ${fmtCard(msg.payload.card)}`);
      break;
    case "play_fail":
      log(`Ungültiger Zug: ${fmtCard(msg.payload.card)}`);
      break;
    case "drawn":
      log(`Gezogene Karte`);
      break;
    case "error":
      log("⚠️ Fehler: " + msg.payload);
      break;
    default:
      log(`Msg: ${JSON.stringify(msg)}`);
  }
}

/* Rendert die Spielerliste */
function renderPlayers(players) {
  document.getElementById("players").textContent =
    "Spieler: " + players.map((p) => p.name).join(", ");
}

/* Rendert den Spielzustand */
function renderState(state) {
  document.getElementById("top").textContent =
    "Ablage: " + (state.top ? fmtCard(state.top) : "-");
  document.getElementById("turn").textContent =
    "Am Zug: " + state.players[state.turn ?? 0];

  const handDiv = document.getElementById("hand");
  handDiv.innerHTML = "";

  

  // Dummy Buttons für Karten (Demo)
  ["7", "8", "9", "10", "J", "Q", "K", "A"].forEach((r) => {
    ["♠", "♥", "♦", "♣"].forEach((s) => {
      const btn = document.createElement("button");
      btn.textContent = `${r}${s}`;
      btn.onclick = () => {
        ws.send(
          JSON.stringify({
            type: "play",
            roomId,
            card: { rank: r, suit: s },
          })
        );
      };
      handDiv.appendChild(btn);
    });
  });

  drawBtn.disabled = false;
}

/* Ermittelt die WebSocket-URL basierend auf dem aktuellen Protokoll */
function getWsUrl() {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${location.host}`;
}

/* Protokollausgabe */
function log(t) {
  const el = document.getElementById("log");
  const line = document.createElement("div");
  line.textContent = t;
  el.appendChild(line);
}

/* Formatiert eine Karte als String */
function fmtCard(c) {
  return `${c.rank}${c.suit}`;
}
