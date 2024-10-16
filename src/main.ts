import http from "node:http";
import { app } from "./http";
import { enableWs } from "./web-socket";

const server = http.createServer(app);
enableWs(server, "/chat");
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
