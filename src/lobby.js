import { v4 as uuid } from "uuid";
import { Game } from "./game.js";

export class Lobby {
  constructor() {
    this.rooms = new Map();     // roomId -> { game, players: Map(ws -> {id,name}) }
    this.wsToRoom = new Map();  // ws -> roomId
  }

  join(ws, roomId = uuid().slice(0, 6), name = "Spieler") {
    if (!roomId) {
      roomId = uuid().slice(0, 6);
    }
    if (!name) {
      name = "Spieler";
    }

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { game: new Game(), players: new Map() });
    }
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error("Join fehlgeschlagen: Raum nicht gefunden");
      return;
    }

    const playerId = uuid().slice(0, 8);
    room.players.set(ws, { id: playerId, name });
    this.wsToRoom.set(ws, roomId);

    safeSend(ws, { type: "joined", payload: { roomId, playerId } });
    this.broadcast(roomId, {
      type: "players",
      payload: Array.from(room.players.values()),
    });
    this.sendState(roomId);
  }

  leave(ws) {
    const roomId = this.wsToRoom.get(ws);
    if (!roomId || !this.rooms.has(roomId)) return;

    const room = this.rooms.get(roomId);
    room.players.delete(ws);
    this.wsToRoom.delete(ws);

    this.broadcast(roomId, {
      type: "players",
      payload: Array.from(room.players.values()),
    });

    if (room.players.size === 0) {
      this.rooms.delete(roomId);
      console.log(`Raum ${roomId} gelöscht (keine Spieler mehr)`);
    }
  }

  start(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error("Start fehlgeschlagen: Raum nicht gefunden");
      return;
    }
    room.game.start(Array.from(room.players.values()).map((p) => p.id));
    this.sendState(roomId);
  }

  play(roomId, ws, card) {
    const room = this.rooms.get(roomId);
    if (!room) {
      safeSend(ws, { type: "error", payload: "Raum nicht gefunden" });
      return;
    }
    const player = room.players.get(ws);
    if (!player) {
      safeSend(ws, { type: "error", payload: "Spieler nicht im Raum" });
      return;
    }

    const ok = room.game.play(player.id, card);
    this.broadcast(roomId, {
      type: ok ? "play_ok" : "play_fail",
      payload: { playerId: player.id, card },
    });
    this.sendState(roomId);
  }

  draw(roomId, ws) {
    const room = this.rooms.get(roomId);
    if (!room) {
      safeSend(ws, { type: "error", payload: "Raum nicht gefunden" });
      return;
    }
    const player = room.players.get(ws);
    if (!player) {
      safeSend(ws, { type: "error", payload: "Spieler nicht im Raum" });
      return;
    }

    const card = room.game.draw(player.id);
    this.broadcast(roomId, {
      type: "drawn",
      payload: { playerId: player.id, card },
    });
    this.sendState(roomId);
  }

  sendState(roomId, ws) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const state = room.game.state();
    const payload = { type: "state", payload: state };

    if (ws) safeSend(ws, payload);
    else this.broadcast(roomId, payload);
  }

  broadcast(roomId, message) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    for (const client of room.players.keys()) {
      safeSend(client, message);
    }
  }
}

// Hilfsfunktion: sicheres Senden
function safeSend(ws, msg) {
  try {
    ws.send(JSON.stringify(msg));
  } catch (e) {
    console.error("Sendefehler:", e);
  }
}
