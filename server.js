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

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

const lobby = new Lobby();

wss.on("connection", (ws) => {
  // Basic handshake
  ws.send(JSON.stringify({ type: "hello", payload: "Willkommen bei Mau Mau" }));

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      ws.send(JSON.stringify({ type: "error", payload: "Ungültiges JSON" }));
      return;
    }

    // Route messages by type
    switch (msg.type) {
      case "join":
        // { type: "join", roomId, name }
        lobby.join(ws, msg.roomId, msg.name);
        break;
      case "start":
        // { type: "start", roomId }
        lobby.start(msg.roomId);
        break;
      case "play":
        // { type: "play", roomId, card }
        lobby.play(msg.roomId, ws, msg.card);
        break;
      case "draw":
        // { type: "draw", roomId }
        lobby.draw(msg.roomId, ws);
        break;
      case "state":
        // { type: "state", roomId }
        lobby.sendState(msg.roomId, ws);
        break;
      default:
        ws.send(JSON.stringify({ type: "error", payload: "Unbekannter Typ" }));
    }
  });

  ws.on("close", () => lobby.leave(ws));
});

httpServer.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
