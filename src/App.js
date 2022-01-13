import React from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components';
import { Home, MainInventory } from './pages';
import NewShoeForm from './NewShoeForm';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<MainInventory />} />
      </Routes>
      <NewShoeForm />
    </div>
  );
}

export default App;
