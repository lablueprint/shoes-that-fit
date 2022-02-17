import React from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import { Header, OrderForm } from './components';
import {
  Home, MainInventory, NewShoeForm, OrderListAdmin,
} from './pages';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<MainInventory />} />
        <Route path="/newshoeform" element={<NewShoeForm />} />
        <Route path="/orderform" element={<OrderForm />} />
        <Route path="/ordersadmin" element={<OrderListAdmin />} />
      </Routes>
    </div>

  );
}

export default App;
