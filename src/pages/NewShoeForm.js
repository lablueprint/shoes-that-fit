import React, { useState } from 'react';
import Popup from './Popup';

// Airtable stuff
const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(airtableConfig.baseKey);

function NewShoeForm() {
  const [location, setLocation] = useState('');
  const [bin, setBin] = useState('');
  const [part, setPart] = useState('');
  const [partDescription, setPartDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  // popup states
  const [popup, setPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quantityDisplay, setQuantityDisplay] = useState(0);

  // clear input fields
  function clear() {
    setLocation('');
    setBin('');
    setPart('');
    setPartDescription('');
    setQuantity('');
  }

  const closePopup = () => setPopup(false);

  // base('TestInventory').select().all().then((records) => { records.forEach(cleanRecord); })
  const inputForm = (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();

        // check for valid input
        const quantityToInt = parseInt(quantity, 10);
        if (Number.isNaN(quantityToInt) || quantityToInt < 0 || location === '' || bin === '' || part === '' || partDescription === '') {
          setSuccess(false);
          setPopup(true);
          return;
        }

        const filter = `AND({Location Name} = '${location}', {Bin Name} = '${bin}', 
        {Part Name} = '${part}', {Part Description} = '${partDescription}')`;
        let totalQuantity = quantityToInt;

        // find the total quantity of all existing matching records and delete the records
        clear();

        base('TestInventory').select({ filterByFormula: filter }).eachPage(
          (records) => {
            if (records.length === 0) { // create a new record if there are no matching ones
              console.log(totalQuantity);
              base('TestInventory').create([
                {
                  fields: {
                    'Client Name': 'Shoes That Fit Warehouse',
                    'Location Name': location,
                    'Bin Name': bin,
                    'Part Name': part,
                    'Part Description': partDescription,
                    Quantity: totalQuantity,
                  },
                },
              ], (err) => {
                if (err) { console.log(err); }
              });
              setSuccess(true);
              setQuantityDisplay(totalQuantity);
              setPopup(true);
              return;
            }

            let currentLength = records.length;
            records.forEach((record) => {
              totalQuantity += parseInt(record.fields.Quantity, 10);
              if (currentLength === 1) {
                // console.log(totalQuantity);
                base('TestInventory').update([
                  {
                    id: record.id,
                    fields: {
                      Quantity: totalQuantity,
                    },
                  },
                ], (err) => {
                  if (err) {
                    console.log(err);
                  }
                });
              } else {
                base('TestInventory').destroy(record.id, (err) => {
                  if (err) {
                    console.log(err);
                  }
                });
                currentLength -= 1;
              }
            });
            setSuccess(true);
            setQuantityDisplay(totalQuantity);
            setPopup(true);
          },
          (err) => { console.log(err); },
        );
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
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
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
      {popup && (
      <Popup
        closePopup={closePopup}
        success={success}
        value={quantityDisplay}
      />
      )}
    </div>
  );
}

export default NewShoeForm;
