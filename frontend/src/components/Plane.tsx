import React from "react";
import Draggable from "react-draggable";
import { IPlane, useGame } from "../contexts/GameContext";

interface PlaneProps {
  plane: IPlane;
}

export const Plane = ({ plane }: PlaneProps) => {
  const { room, selectPlane, handleOnStop, rotatePlane } = useGame();

  const gridSize = room.gridSize;

  const planeSelectedClass = room.planeSelectedId === plane.id ? 'plane-selected' : '';
  const planeNotValidClass = !plane.valid ? 'plane-not-valid' : '';

  const handleRotatePlane = (e: React.MouseEvent, plane: IPlane) => {
    e.preventDefault();
    rotatePlane(plane);
  }

  return (
    <Draggable
      grid={[32, 32]}
      bounds={{ left: 0, top: 0, right: gridSize * 32 - 32, bottom: gridSize * 32 - 32 }}
      defaultPosition={{ x: plane.head.col * 32, y: plane.head.row * 32 }}
      onStop={(e, ui) => handleOnStop({ plane, x: ui.x, y: ui.y })}
    >
      <div
        className={`plane ${plane.direction} ${planeSelectedClass} ${planeNotValidClass} `}
        onMouseDownCapture={() => selectPlane(plane.id)}
        onTouchStart={() => selectPlane(plane.id)}
        onContextMenu={e => handleRotatePlane(e, plane)}
        // className={`plane ${plane.pos} ${planeSelectedClass} ${planeMovableClass} ${planeNotValidClass} ${planeDestroyedClass}`}
      >
        <div className="plane-piece head h1"></div>
        <div className="plane-piece big-wing bw1"></div>
        <div className="plane-piece big-wing bw2"></div>
        <div className="plane-piece big-wing bw3"></div>
        <div className="plane-piece big-wing bw4"></div>
        <div className="plane-piece big-wing bw5"></div>
        <div className="plane-piece body b1"></div>
        <div className="plane-piece small-wing sw1"></div>
        <div className="plane-piece small-wing sw2"></div>
        <div className="plane-piece small-wing sw3"></div>
      </div>
    </Draggable>
  );
};
