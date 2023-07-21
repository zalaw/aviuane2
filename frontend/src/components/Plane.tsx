import React from 'react'
import Draggable from 'react-draggable'
import { useGame } from '../contexts/GameContext';

export const Plane = () => {
  const { room } = useGame();

  const gridSize = room.gridSize;

  return <Draggable
  grid={[32, 32]}
  bounds={{left: 0, top: 0, right: gridSize * 32 - 32, bottom: gridSize * 32 - 32}}
  // defaultPosition={{ x: plane.head.col * 32, y: plane.head.row * 32 }}
  // onStop={(e, ui) => handleOnStop(plane, ui)}
>
  <div
    className='plane N'
    // className={`plane ${plane.pos} ${planeSelectedClass} ${planeMovableClass} ${planeNotValidClass} ${planeDestroyedClass}`}
    // onClick={() => selectPlane(plane)}
    // onTouchStart={() => selectPlane(plane)}
    // onContextMenu={e => handleRotatePlane(e, plane)}
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
}
