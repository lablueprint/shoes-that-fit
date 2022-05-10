import React, { useState } from 'react';
import './NewShoeForm.css';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import Popup from './Popup';

// Airtable stuff

function NewShoeForm({ isLoggedIn, base }) {
  const [location, setLocation] = useState('');
  const [part, setPart] = useState('');
  const [partDescription, setPartDescription] = useState(false);
  const [quantity, setQuantity] = useState('');

  // popup states
  const [popup, setPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // clear input fields
  function clear() {
    setLocation('');
    setPart('');
    setQuantity('');
  }

  function addRecord(delta) {
    base('Records').create([
      {
        fields: {
          Message: `Added ${delta} shoes to inventory.`,
        },
      },
    ], (err) => {
      if (err) { console.log(err); }
    });
  }

  const closePopup = () => setPopup(false);

  // base('TestInventory').select().all().then((records) => { records.forEach(cleanRecord); })
  const inputForm = (
    <form
      onSubmit={async (evt) => {
        evt.preventDefault();
        // check for valid input
        const quantityToInt = parseInt(quantity, 10);
        if (Number.isNaN(quantityToInt) || quantityToInt <= 0 || location === '' || part === '') {
          if (Number.isNaN(quantityToInt) || quantityToInt <= 0) {
            setPopupMessage('Make sure to input a positive number for quantity!');
          } else {
            setPopupMessage('Make sure to fill out all fields!');
          }

          setSuccess(false);
          setPopup(true);
          return;
        }
        addRecord(quantityToInt);
        const wideWidth = partDescription ? 'Wide' : 'Not Wide';

        const filter = `AND({Location Name} = '${location}',
        {Part Name} = '${part}', {Wide Width} = '${wideWidth}')`;
        let totalQuantity = quantityToInt;

        // find the total quantity of all existing matching records and delete the records
        clear();

        await base('TestInventory').select({ filterByFormula: filter }).eachPage(
          async (records) => {
            if (records.length === 0) { // create a new record if there are no matching ones
              await base('TestInventory').create([
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
              setPopupMessage(`New quantity: ${totalQuantity}`);
              setPopup(true);
              return;
            }

            let currentLength = records.length;
            records.forEach(async (record) => {
              totalQuantity += parseInt(record.fields.Quantity, 10);
              if (currentLength === 1) {
                await base('TestInventory').update([
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
                await base('TestInventory').destroy(record.id, (err) => {
                  if (err) {
                    console.log(err);
                  }
                });
                currentLength -= 1;
              }
            });
            setSuccess(true);
            setPopupMessage(`New quantity: ${totalQuantity}`);
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
    !isLoggedIn
      ? (<Navigate to="/" />)
      : (
        <div>
          {popup && (
          <Popup
            closePopup={closePopup}
            success={success}
            message={popupMessage}
          />
          )}
          {inputForm}
        </div>
      )
  );
}

export default NewShoeForm;

NewShoeForm.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  base: PropTypes.func.isRequired,
};
