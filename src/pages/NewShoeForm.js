import React, { useState } from 'react';
import Popup from './Popup';
import './NewShoeForm.css';

// Airtable stuff
const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(airtableConfig.baseKey);

function NewShoeForm() {
  const [location, setLocation] = useState('');
  const [part, setPart] = useState('');
  const [partDescription, setPartDescription] = useState(false);
  const [quantity, setQuantity] = useState('');

  // popup states
  const [popup, setPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quantityDisplay, setQuantityDisplay] = useState(0);

  // clear input fields
  function clear() {
    setLocation('');
    setPart('');
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
        if (Number.isNaN(quantityToInt) || quantityToInt < 0 || location === '' || part === '') {
          setSuccess(false);
          setPopup(true);
          return;
        }

        const wideWidth = partDescription ? 'Wide' : 'Not Wide';

        const filter = `AND({Location Name} = '${location}',
        {Part Name} = '${part}', {Wide Width} = '${wideWidth}')`;
        let totalQuantity = quantityToInt;

        // find the total quantity of all existing matching records and delete the records
        clear();

        base('TestInventory').select({ filterByFormula: filter }).eachPage(
          (records) => {
            if (records.length === 0) { // create a new record if there are no matching ones
              base('TestInventory').create([
                {
                  fields: {
                    'Client Name': 'Shoes That Fit Warehouse',
                    'Warehouse Name': 'STF Warehouse',
                    'Location Name': location,
                    'Part Name': part,
                    'Wide Width': wideWidth,
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
      <div className="container">
        <div>
          <h2>Add Inventory</h2>
        </div>
        <div className="fields">
          <div>
            <label>
              <h4>Location</h4>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              <h4>Part Name</h4>
              <input type="text" value={part} onChange={(e) => setPart(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              <h4>Wide width?</h4>
              <input className="check" type="checkbox" onChange={(e) => setPartDescription(e.target.checked)} />
            </label>
          </div>
          <div>
            <label>
              <h4>Quantity</h4>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </label>
          </div>
        </div>
        <div className="submitBtn">
          <input
            value="Add to inventory"
            type="submit"
          />
        </div>
      </div>
    </form>
  );

  return (
    <div>
      {popup && (
      <Popup
        closePopup={closePopup}
        success={success}
        value={quantityDisplay}
      />
      )}
      {inputForm}
    </div>
  );
}

export default NewShoeForm;
