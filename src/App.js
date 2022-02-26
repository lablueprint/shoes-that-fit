import React from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import OrderForm from './components/orderform';

import {
  Home, MainInventory, NewShoeForm, AdminList,
} from './pages';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminlist" element={<AdminList />} />
        <Route path="/inventory" element={<MainInventory />} />
        <Route path="/newshoeform" element={<NewShoeForm />} />
        <Route path="/orderform" element={<OrderForm />} />
      </Routes>
    </div>

  );
}

export default App;
