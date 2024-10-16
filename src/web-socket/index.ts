import type { Server } from "http";
import WebSocket from "ws";

export function enableWs(server: Server, path: string) {
  const wss = new WebSocket.Server({ server, path });
  const messages: any[] = [];

  wss.on("connection", (ws) => {
    ws.on("open", () => {
      console.log("Client connected");
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
        ws.send(JSON.stringify({ error: "Invalid message format" }));
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return wss;
}
