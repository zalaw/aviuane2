export interface IPiece {
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
  planes: IPlane[],
  ready: boolean,
  playAgain: boolean,
  disconnected: boolean
}

export interface ICell {
  row: number,
  col: number
}

export interface ITurn {
  clientTurnIndex: number,
  cell: ICell,
  status: 'headHit' | 'hit' | 'miss'
}