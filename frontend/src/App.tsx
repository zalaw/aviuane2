import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/Navbar';
import Grid from './components/Grid';

function App() {
  return (
    <>
      <Navbar />
  
      <div className='main-container'>
        <Grid primary={true} />
        <Grid />
      </div>
    </>
  );
}

export default App;
