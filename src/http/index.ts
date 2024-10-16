import express from "express";
import { PubSub } from "../events/pub-sub";

export const app = express();
app.use(express.json());

app.get("/health", (_request, response, _next) => {
  PubSub.getInstance().publish("health");
  response.status(200).json({ health: true });
});
