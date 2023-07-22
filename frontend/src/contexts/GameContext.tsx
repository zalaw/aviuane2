import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface IPiece {
  row: number;
  col: number;
  hit: boolean;
}

export interface IPlane {
  id: number;
  head: IPiece;
  pieces: IPiece[];
  direction: "N" | "E" | "S" | "W";
  directionIndex: number;
  valid: boolean;
}

interface IRoomContext {
  socket: Socket | null;
  directions: ["N", "E", "S", "W"];
  room: {
    gridSize: number;
    myPlanes: IPlane[];
  };
}

const defaultState: IRoomContext = {
  socket: null,
  directions: ["N", "E", "S", "W"],
  room: {
    gridSize: 10,
    myPlanes: [
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
  },
};

const GameContext = createContext<IRoomContext>(defaultState);

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState(defaultState.socket);
  const [room, setRoom] = useState(defaultState.room);

  useEffect(() => {
    const s = io(process.env.RAILWAY_STATIC_URL || "http://localhost:3001", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return <GameContext.Provider value={defaultState}>{children}</GameContext.Provider>;
}
