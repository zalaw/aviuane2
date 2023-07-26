import React from "react";
import { Plane } from "./Plane";
import { useGame } from "../contexts/GameContext";

interface GridProps {
  primary?: boolean;
}

const Grid = ({ primary = false }: GridProps) => {
  const { room } = useGame();

  const gridSize = room!.gridSize;

  console.log(room);

  const cells = Array.from({ length: gridSize * gridSize }).map((_: any, index: number) => {
    const markerCol = index < gridSize ? <div className="marker marker-col">{index + 1}</div> : null;
    const markerRow =
      index % gridSize === 0 ? (
        <div className="marker marker-row">{String.fromCharCode(65 + index / gridSize)}</div>
      ) : null;

    const cell = (
      <div key={`cell-${index}`} className="cell">
        {markerCol}
        {markerRow}
      </div>
    );

    return cell;
  });

  const gridStyle = {
    width: `${gridSize * 2}rem`,
    height: `${gridSize * 2}rem`,
    minWidth: `${gridSize * 2}rem`,
    minHeight: `${gridSize * 2}rem`,
  };

  return (
    <>
      <div style={gridStyle} className="grid-container">
        {cells}

        {primary && room!.clients[room!.clientTurnIndex!]?.planes.map(plane => <Plane key={plane.id} plane={plane} />)}
      </div>
    </>
  );
};

export default Grid;
