import React from 'react'
import { Plane } from './Plane';
import { useGame } from '../contexts/GameContext';

interface GridProps {
  primary?: boolean
}

const Grid = ({ primary = false }: GridProps) => {
  const { room } = useGame();

  const gridSize = room.gridSize;

  const cells = Array.from({ length: gridSize * gridSize }).map((_: any, index: number) => {
    const markerCol = index < gridSize ? <div className='marker marker-col'>{index + 1}</div> : null;
    const markerRow = index % gridSize === 0 ? <div className='marker marker-row'>{String.fromCharCode(65 + index / gridSize)}</div>: null;

    const cell = <div key={`cell-${index}`} className='cell'>
      {markerCol}
      {markerRow}
    </div>

    return cell;
  })

  const gridStyle = {
    width: `${gridSize * 2}rem`,
    height: `${gridSize * 2}rem`,
    minwidth: `${gridSize * 2}rem`,
    minHeight: `${gridSize * 2}rem`, 
  }

  return (
    <>
    {primary ? 'Primary' : 'Secondary'}

    <div style={gridStyle} className='grid-container'>
      {cells}

      {primary && <Plane />}
    </div>


    </>
  )
}

export default Grid