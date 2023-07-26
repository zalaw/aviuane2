import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import crypto from 'crypto'

import { IClient, ITurn } from 'src/shared/interfaces'

interface IRoomObj {
  code: string,
  clients: IClient[],
  started: boolean,
  finished: boolean,
  turns: ITurn[],
  clientTurnIndex: number | null,
  clientWinnerId: string | null,
  eligibleForDraw: boolean,
  gridSize: number,
  numOfPlanes: number
}

config();

const app = express();
const PORT = process.env.PORT || 3001;
const server = createServer(app);

const rooms = new Map();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET"],
  },
});

io.on("connection", socket => {
  console.log(`${socket.id} connected`);

  socket.on('CREATE_ROOM', (data, callback) => {
    console.log('CREATE_ROOM')
    const code = generateCode();

    const roomObj: IRoomObj = {
      code,
      clients: [
        {
          id: socket.id,
          planes: [
            {
              id: 1,
              head: { row: 0, col: 2, hit: false },
              pieces: [
                { row: 1, col: 0, hit: false },
                { row: 1, col: 1, hit: false },
                { row: 1, col: 2, hit: false },
                { row: 1, col: 3, hit: false },
                { row: 1, col: 4, hit: false },
                { row: 2, col: 2, hit: false },
                { row: 3, col: 1, hit: false },
                { row: 3, col: 2, hit: false },
                { row: 3, col: 3, hit: false },
              ],
              direction: "N",
              directionIndex: 0,
              valid: true,
            },
            {
              id: 2,
              head: { row: 4, col: 2, hit: false },
              pieces: [
                { row: 5, col: 0, hit: false },
                { row: 5, col: 1, hit: false },
                { row: 5, col: 2, hit: false },
                { row: 5, col: 3, hit: false },
                { row: 5, col: 4, hit: false },
                { row: 6, col: 2, hit: false },
                { row: 7, col: 1, hit: false },
                { row: 7, col: 2, hit: false },
                { row: 7, col: 3, hit: false },
              ],
              direction: "N",
              directionIndex: 0,
              valid: true,
            },
            {
              id: 3,
              head: { row: 3, col: 5, hit: false },
              pieces: [
                { row: 2, col: 7, hit: false },
                { row: 2, col: 6, hit: false },
                { row: 2, col: 5, hit: false },
                { row: 2, col: 4, hit: false },
                { row: 2, col: 3, hit: false },
                { row: 1, col: 5, hit: false },
                { row: 0, col: 6, hit: false },
                { row: 0, col: 5, hit: false },
                { row: 0, col: 4, hit: false },
              ],
              direction: "S",
              directionIndex: 2,
              valid: true,
            },
          ],
          ready: false,
          playAgain: false,
          disconnected: false
        }
      ],
      started: false,
      finished: false,
      turns: [],
      clientTurnIndex: null,
      clientWinnerId: null,
      eligibleForDraw: true,
      gridSize: 10,
      numOfPlanes: 3
    }

    // socket.join(code);

     callback(roomObj)
  })

  socket.on('JOIN_ROOM', ({ code }: { code: string }, callback) => {
    console.log('TRYING TO JOIN ', code);
    callback();
  })
});

const generateCode = () => {
  const id = crypto.randomUUID().slice(0, 4).toUpperCase();

  if (id in rooms) generateCode();

  return id;
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
