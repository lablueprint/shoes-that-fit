import React, { useState } from 'react';

// Airtable stuff
const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function NewShoeForm() {
  const [location, setLocation] = useState('');
  const [bin, setBin] = useState('');
  const [part, setPart] = useState('');
  const [partDescription, setPartDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  function clear() {
    setLocation('');
    setBin('');
    setPart('');
    setPartDescription('');
    setQuantity('');
  }

  const inputForm = (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        const quantityToInt = parseInt(quantity, 10);
        if (Number.isNaN(quantityToInt)) { // invalid quantity input
          console.log('Invalid input');
          clear();
          return;
        }

        base('TestInventory').create([
          {
            fields: {
              'Client Name': 'Shoes That Fit Warehouse',
              'Location Name': location,
              'Bin Name': bin,
              'Part Name': part,
              'Part Description': partDescription,
              Quantity: quantityToInt,
            },
          },
        ], (err, records) => {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach((record) => {
            console.log(record.getId());
          });
        });

        clear();
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
          Part Description:
          <input type="text" value={partDescription} onChange={(e) => setPartDescription(e.target.value)} />
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

export default NewShoeForm;
