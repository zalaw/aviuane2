import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from 'react-router-dom';

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

export interface IClient {
  id: string,
  connected: boolean,

}

interface IRoomContext {
  socket: Socket | null;
  directions: ["N", "E", "S", "W"];
  room: {
    gridSize: number;
    planeSelectedId: number | null,
    myPlanes: IPlane[];
    clients: [] | [IClient] | [IClient, IClient]
  };
  createRoom: () => void,
  selectPlane: (planeId: number | null) => void,
  handleOnStop: ({ plane, x, y }: { plane: IPlane, x: number, y: number }) => void,
  rotatePlane: (plane: IPlane, dir?: number) => void
}

const defaultState: IRoomContext = {
  socket: null,
  directions: ["N", "E", "S", "W"],
  room: {
    gridSize: 10,
    planeSelectedId: null,
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
    clients: []
  },
  createRoom: () => {},
  selectPlane: () => {},
  handleOnStop: () => {},
  rotatePlane: () => {}
};

const GameContext = createContext<IRoomContext>(defaultState);

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState(defaultState.socket);
  const [room, setRoom] = useState(defaultState.room);

  const navigate = useNavigate();

  useEffect(() => {
    const s = io(process.env.RAILWAY_STATIC_URL || "http://localhost:3001", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    setSocket(s);

    s.emit('CREATE_ROOM', { x: 420 }, ({ code }: { code: string }) => {
      navigate(`/${code}`)
    })

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    console.log('socket live')

    console.log(socket);
  }, [socket])

  const createRoom = () => {
      console.log('Sending CREATE_ROOM')

    console.log(socket);

    socket?.emit('CREATE_ROOM', { x: 420 }, (response: any) => {
      console.log(response);
    })
    
  }

  const selectPlane = (planeId: number | null) => {
    setRoom(r => ({ ...r, planeSelectedId: planeId }))
  }

  const handleOnStop = ({ plane, x, y }: { plane: IPlane, x: number, y: number }) => {
    const row = Math.floor(y / 32)
    const col = Math.floor(x / 32)

    plane.head.row = row;
    plane.head.col = col;

    updatePieces(plane);

    room.myPlanes.forEach(p => checkIfPlaneIsValid(p));

    setRoom(r => ({ ...r }));
  }

  const checkIfPlaneIsValid = (plane: IPlane) => {
    plane.valid = true;

    if ([plane.head].concat(plane.pieces).some(x => x.row < 0 || x.row >= room.gridSize || x.col < 0 || x.col >= room.gridSize)) plane.valid = false;

    const planesExceptThis = room.myPlanes.filter(x => x.id !== plane.id);

    planesExceptThis.forEach(p => {
      const overlapping = [plane.head].concat(plane.pieces).some(x => [p.head].concat(p.pieces).some(y => y.row === x.row && y.col === x.col));

      if (overlapping) {
        plane.valid = false;
        p.valid = false;
      }
    })

    return true;
  }

  const rotatePlane = (plane: IPlane, dir: number = 1) => {
    plane.directionIndex = dir === 1 ? (plane.directionIndex + 1) % 4 : (plane.directionIndex + 3) % 4;
    plane.direction = defaultState.directions[plane.directionIndex];

    updatePieces(plane);

    room.myPlanes.forEach(p => checkIfPlaneIsValid(p));

    setRoom(r => ({ ...r }));
  }

  const updatePieces = (plane: IPlane) => {
    if (plane.direction === "N") {
      plane.pieces[0] = { row: plane.head.row + 1, col: plane.head.col - 2, hit: false };
      plane.pieces[1] = { row: plane.head.row + 1, col: plane.head.col - 1, hit: false };
      plane.pieces[2] = { row: plane.head.row + 1, col: plane.head.col, hit: false };
      plane.pieces[3] = { row: plane.head.row + 1, col: plane.head.col + 1, hit: false };
      plane.pieces[4] = { row: plane.head.row + 1, col: plane.head.col + 2, hit: false };
      plane.pieces[5] = { row: plane.head.row + 2, col: plane.head.col, hit: false };
      plane.pieces[6] = { row: plane.head.row + 3, col: plane.head.col - 1, hit: false };
      plane.pieces[7] = { row: plane.head.row + 3, col: plane.head.col, hit: false };
      plane.pieces[8] = { row: plane.head.row + 3, col: plane.head.col + 1, hit: false };
    } else if (plane.direction === "E") {
      plane.pieces[0] = { row: plane.head.row - 2, col: plane.head.col - 1, hit: false };
      plane.pieces[1] = { row: plane.head.row - 1, col: plane.head.col - 1, hit: false };
      plane.pieces[2] = { row: plane.head.row, col: plane.head.col - 1, hit: false };
      plane.pieces[3] = { row: plane.head.row + 1, col: plane.head.col - 1, hit: false };
      plane.pieces[4] = { row: plane.head.row + 2, col: plane.head.col - 1, hit: false };
      plane.pieces[5] = { row: plane.head.row, col: plane.head.col - 2, hit: false };
      plane.pieces[6] = { row: plane.head.row - 1, col: plane.head.col - 3, hit: false };
      plane.pieces[7] = { row: plane.head.row, col: plane.head.col - 3, hit: false };
      plane.pieces[8] = { row: plane.head.row + 1, col: plane.head.col - 3, hit: false };
    } else if (plane.direction === "S") {
      plane.pieces[0] = { row: plane.head.row - 1, col: plane.head.col - 2, hit: false };
      plane.pieces[1] = { row: plane.head.row - 1, col: plane.head.col - 1, hit: false };
      plane.pieces[2] = { row: plane.head.row - 1, col: plane.head.col, hit: false };
      plane.pieces[3] = { row: plane.head.row - 1, col: plane.head.col + 1, hit: false };
      plane.pieces[4] = { row: plane.head.row - 1, col: plane.head.col + 2, hit: false };
      plane.pieces[5] = { row: plane.head.row - 2, col: plane.head.col, hit: false };
      plane.pieces[6] = { row: plane.head.row - 3, col: plane.head.col - 1, hit: false };
      plane.pieces[7] = { row: plane.head.row - 3, col: plane.head.col, hit: false };
      plane.pieces[8] = { row: plane.head.row - 3, col: plane.head.col + 1, hit: false };
    } else {
      plane.pieces[0] = { row: plane.head.row - 2, col: plane.head.col + 1, hit: false };
      plane.pieces[1] = { row: plane.head.row - 1, col: plane.head.col + 1, hit: false };
      plane.pieces[2] = { row: plane.head.row, col: plane.head.col + 1, hit: false };
      plane.pieces[3] = { row: plane.head.row + 1, col: plane.head.col + 1, hit: false };
      plane.pieces[4] = { row: plane.head.row + 2, col: plane.head.col + 1, hit: false };
      plane.pieces[5] = { row: plane.head.row, col: plane.head.col + 2, hit: false };
      plane.pieces[6] = { row: plane.head.row - 1, col: plane.head.col + 3, hit: false };
      plane.pieces[7] = { row: plane.head.row, col: plane.head.col + 3, hit: false };
      plane.pieces[8] = { row: plane.head.row + 1, col: plane.head.col + 3, hit: false };
    }
  };

  const value = {
    socket: socket,
    room: room,
    directions: defaultState.directions,
    createRoom,
    selectPlane,
    handleOnStop,
    rotatePlane
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
