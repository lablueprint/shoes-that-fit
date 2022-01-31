import React from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components';
import { Home, MainInventory, NewShoeForm } from './pages';
import OrderForm from './components/orderform';

function App() {
  return (
    <div className="App">
      <Header />
      <OrderForm />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<MainInventory />} />
        <Route path="/newshoeform" element={<NewShoeForm />} />
      </Routes>
    </div>

  );
}

export default App;
