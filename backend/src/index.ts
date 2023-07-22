import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

config();

const app = express();
const PORT = process.env.PORT || 3001;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET"],
  },
});

io.on("connection", socket => {
  console.log(`${socket.id} connected`);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
