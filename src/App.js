import React from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components';
import { Home, MainInventory } from './pages';
import Orderform from './components/orderform';

function App() {
  return (
    <div className="App">
      <Header />
      <Orderform />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<MainInventory />} />
      </Routes>
    </div>

  );
}

export default App;
