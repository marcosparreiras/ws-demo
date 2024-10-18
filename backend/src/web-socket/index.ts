import type { Server } from "http";
import WebSocket from "ws";
import { PubSub } from "../events/pub-sub";

export function enableWs(server: Server, path: string) {
  const wss = new WebSocket.Server({ server, path });
  const messages: any[] = [];

  wss.on("connection", (ws) => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ message: "new client connected" }));
    });

    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        messages.push(parsedMessage);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(parsedMessage));
          }
        });
      } catch (error) {
        console.error("Invalid message received:", error);
        ws.send(JSON.stringify({ error: "invalid message format" }));
      }
    });

    ws.on("close", () => {
      wss.clients.forEach((client) =>
        client.send(JSON.stringify({ message: "client disconnected" }))
      );
    });
  });

  PubSub.getInstance().subscribe({
    event: "health",
    action() {
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ message: "A health check was executed" }));
      });
    },
  });

  return wss;
}
