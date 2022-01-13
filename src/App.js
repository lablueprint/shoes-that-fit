import React from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components';
import Card from './components/card';
import { Home, MainInventory } from './pages';

function App() {
  // const shoes = [{ shoe_brand: 'Adidas' }];
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<MainInventory />} />
      </Routes>
      <Card
        school="UCLA"
        first_name="Gene"
        last_name="Block"
        email="abc@gmail.com"
        phone="1234567890"
        shoes="[{test}]"
      />
    </div>
  );
}

export default App;
