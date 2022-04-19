import React from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import { Header, OrderForm } from './components';
import {
  Home, MainInventory, NewShoeForm, Records,
} from './pages';

function App() {
  return (
    <div className="App">
      <Records />
      <NewShoeForm />
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/inventory" element={<MainInventory />} />
        <Route exact path="/records" element={<Records />} />
        <Route exact path="/newshoeform" element={<NewShoeForm />} />
        <Route exact path="/orderform" element={<OrderForm />} />

      </Routes>
    </div>

  );
}

export default App;
