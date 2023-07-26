import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { IPlane, IClient, ITurn } from '../shared/interfaces'

interface IRoom {
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

interface IRoomContext {
  socket: Socket | null;
  directions: ["N", "E", "S", "W"];  
  myTurnIndex: 0 | 1,
  planeSelectedId: number | null,
  room: IRoom | null,
  createRoom: () => void,
  selectPlane: (planeId: number | null) => void,
  handleOnStop: ({ plane, x, y }: { plane: IPlane, x: number, y: number }) => void,
  rotatePlane: (plane: IPlane, dir?: number) => void
}

const defaultState: IRoomContext = {
  socket: null,
  directions: ["N", "E", "S", "W"],
  myTurnIndex: 0,
  planeSelectedId: null,
  room: null,
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
  const [room, setRoom] = useState<IRoom | null>(defaultState.room);
  const [myTurnIndex, setMyTurnIndex] = useState(defaultState.myTurnIndex);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const code = window.location.pathname.split('/').pop();

  useEffect(() => {
    const s = io(process.env.RAILWAY_STATIC_URL || "http://localhost:3001", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    setSocket(s);

    if (code) {
      s.emit('JOIN_ROOM', { code }, () => {
        setMyTurnIndex(1);
        navigate(`/${code}`)

        setTimeout(() => {
          setLoading(false);
        }, 1000)
      })
    } else {
      s.emit('CREATE_ROOM', null, (roomObj: IRoom) => {
        setRoom(roomObj);
        setMyTurnIndex(0);
        navigate(`/${code}`)
        
          setTimeout(() => {
            setLoading(false);
          }, 1000)
      })
    }

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
    setRoom(r => ({ ...r!, planeSelectedId: planeId }))
  }

  const handleOnStop = ({ plane, x, y }: { plane: IPlane, x: number, y: number }) => {
    const row = Math.floor(y / 32)
    const col = Math.floor(x / 32)

    plane.head.row = row;
    plane.head.col = col;

    updatePieces(plane);

    room!.clients[myTurnIndex].planes.forEach(p => checkIfPlaneIsValid(p));

    updateRoomData();
  }

  const checkIfPlaneIsValid = (plane: IPlane) => {
    plane.valid = true;

    if ([plane.head].concat(plane.pieces).some(x => x.row < 0 || x.row >= room!.gridSize || x.col < 0 || x.col >= room!.gridSize)) plane.valid = false;

    const planesExceptThis = room!.clients[myTurnIndex].planes.filter(x => x.id !== plane.id);

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

    room!.clients[myTurnIndex].planes.forEach(p => checkIfPlaneIsValid(p));

    updateRoomData();
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

  const updateRoomData = () => {
    setRoom(r => ({ ...r! }))
  }

  const value = {
    socket: socket,
    directions: defaultState.directions,
    myTurnIndex: defaultState.myTurnIndex,
    planeSelectedId: defaultState.planeSelectedId,
    room: room,
    createRoom,
    selectPlane,
    handleOnStop,
    rotatePlane
  }

  return <GameContext.Provider value={value}>{loading ? <h1>Loading...</h1> : children}</GameContext.Provider>;
}
