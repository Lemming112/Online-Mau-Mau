import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { Lobby } from "./src/lobby.js";

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN || "*";

const app = express();
app.use(cors({ origin: ORIGIN }));
app.use(express.static("public"));

// einfache Test-Route, damit Railway eine HTTP-Antwort bekommt
app.get("/", (req, res) => {
  res.send("Mau Mau Server läuft 🚀");
});

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

const lobby = new Lobby();

wss.on("connection", (ws) => {
  console.log("Neue Verbindung");

  // Begrüßung
  safeSend(ws, { type: "hello", payload: "Willkommen bei Mau Mau" });

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString()); // wichtig: toString()
    } catch (e) {
      console.error("Ungültiges JSON:", e);
      safeSend(ws, { type: "error", payload: "Ungültiges JSON" });
      return;
    }

    try {
      switch (msg.type) {
        case "join":
          lobby.join(ws, msg.roomId, msg.name);
          break;
        case "start": {
          // Falls roomId fehlt, aus Mapping holen
          const rid = msg.roomId || lobby.wsToRoom.get(ws);
          lobby.start(rid);
          break;
        }
        case "play":
          lobby.play(msg.roomId || lobby.wsToRoom.get(ws), ws, msg.card);
          break;
        case "draw":
          lobby.draw(msg.roomId || lobby.wsToRoom.get(ws), ws);
          break;
        case "state":
          lobby.sendState(msg.roomId || lobby.wsToRoom.get(ws), ws);
          break;
        default:
          safeSend(ws, { type: "error", payload: "Unbekannter Typ" });
      }
    } catch (err) {
      console.error("Fehler bei Verarbeitung:", err);
      safeSend(ws, { type: "error", payload: "Serverfehler" });
    }
  });

  ws.on("close", () => {
    console.log("Verbindung geschlossen");
    lobby.leave(ws);
  });

  ws.on("error", (err) => {
    console.error("WS-Fehler:", err);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

// Hilfsfunktion: sendet sicher, ohne Crash
function safeSend(ws, msg) {
  try {
    ws.send(JSON.stringify(msg));
  } catch (e) {
    console.error("Sendefehler:", e);
  }
}
