import React from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import { Header, Nav } from './components';
import {
  Home, MainInventory, NewShoeForm, AdminList, OrderForm, OrderListAdmin,
} from './pages';

function App() {
  return (
    <div className="App">
      <Header />
      <Nav />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/inventory" element={<MainInventory />} />
        <Route path="/newshoeform" element={<NewShoeForm />} />
        <Route path="/orderform" element={<OrderForm />} />
        <Route path="/adminlist" element={<AdminList />} />
        <Route path="/viewhistory" element={<OrderListAdmin />} />
      </Routes>
    </div>

  );
}

export default App;
