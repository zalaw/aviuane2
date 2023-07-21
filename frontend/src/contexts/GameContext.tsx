import React, { ReactNode, createContext, useContext, useState } from "react";
import { Socket } from "socket.io-client";

interface IRoomContext {
  socket: Socket | null,
  rotations: ['N', 'E', 'S', 'W'],
  room: {
    gridSize: number,
    myPlanes: any[]
  }
}

const defaultState = {
  socket: null,
  rotations: ['N', 'E', 'S', 'W'],
  room: {
    gridSize: 10,
    myPlanes: []
  }
} as IRoomContext

const GameContext = createContext<IRoomContext>(defaultState);

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState(defaultState.socket);
  const [room, setRoom] = useState(defaultState.room);
  


  return <GameContext.Provider value={defaultState}>{children}</GameContext.Provider>;
}