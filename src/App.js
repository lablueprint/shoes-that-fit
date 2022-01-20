import React from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components';
// import Card from './components/card';
import { Home, MainInventory } from './pages';
import Orderform from './components/orderform';

function App() {
  //  const shoes = [{ shoeBrand: 'Adidas', shoeSize: [3, 4, 6, 7], quantity: [10, 15, 10, 5] },
  //  { shoeBrand: 'New Balance', shoeSize: [4, 6, 7], quantity: [20, 5, 5] }];
  return (
    <div className="App">
      <Header />
      <Orderform />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<MainInventory />} />
      </Routes>
      {/* <Card
        school="UCLA"
        firstName="Gene"
        lastName="Block"
        email="abc@gmail.com"
        phone="1234567890"
        shoes={shoes}
      /> */}
    </div>

  );
}

export default App;
