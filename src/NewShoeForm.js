import React, { useState } from 'react';

function NewShoe() {
  const [location, setLocation] = useState('');
  const [bin, setBin] = useState('');
  const [part, setPart] = useState('');
  const [quantity, setQuantity] = useState('');

  const inputForm = (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        console.log(`Location: ${location}`);
        console.log(`Bin Name: ${bin}`);
        console.log(`Part Name: ${part}`);
        console.log(`Quantity: ${quantity}`);

        setLocation('');
        setBin('');
        setPart('');
        setQuantity('');
      }}
    >
      <div>
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Bin Name:
          <input type="text" value={bin} onChange={(e) => setBin(e.target.value)} />
        </label>

      </div>
      <div>
        <label>
          Part Name:
          <input type="text" value={part} onChange={(e) => setPart(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Quantity:
          <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
      </div>
      <div>
        <input
          type="submit"
        />
      </div>
    </form>
  );

  return (
    <div>
      {inputForm}
    </div>
  );
}

export default NewShoe;
