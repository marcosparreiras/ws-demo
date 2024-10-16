import express from "express";

export const app = express();
app.use(express.json());

app.get("/health", (_request, response, _next) => {
  response.status(200).json({ health: true });
});
