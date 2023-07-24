import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/Navbar';
import Grid from './components/Grid';
import { useGame } from './contexts/GameContext';

function App() {
  const { selectPlane, createRoom } = useGame();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !(e.target as HTMLElement).classList.contains("plane-piece") &&
        !(e.target as HTMLElement).classList.contains("rotate-btn") &&
        !(e.target as HTMLElement).classList.contains("plane")
      ) {
        selectPlane(null);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Navbar />
  
      <div className='main-container'>
        <Grid primary={true} />
        <Grid />
      </div>

      <button onClick={() => createRoom()}>Test</button>
    </>
  );
}

export default App;
