import React, { useState } from 'react';
import Popup from './Popup';
import styles from './NewShoeForm.module.css';

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
  const [isWide, setWide] = useState(false);
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
      onSubmit={(evt) => {
        evt.preventDefault();
        // check for valid input
        const quantityToInt = parseInt(quantity, 10);
        if (Number.isNaN(quantityToInt) || quantityToInt <= 0 || location === '' || part === '') {
          if (location === '' || part === '') {
            setPopupMessage('Make sure to fill out all fields.');
          } else {
            setPopupMessage('Quantity should be a positive number.');
          }

          setSuccess(false);
          setPopup(true);
          return;
        }
        addRecord(quantityToInt);
        const wideBool = isWide ? 1 : '';

        const filter = `AND({Part Name} = '${part}', {Bin Name} = '${location}',
        {Wide Width} = '${wideBool}')`;
        let totalQuantity = quantityToInt;

        // find the total quantity of all existing matching records and delete the records
        clear();

        base('TestInventory').select({ filterByFormula: filter }).eachPage(
          (records) => {
            if (records.length === 0) { // create a new record if there are no matching ones
              base('TestInventory').create([
                {
                  fields: {
                    'Part Name': part,
                    'Bin Name': location,
                    'Wide Width': isWide,
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
            setPopupMessage(`New quantity: ${totalQuantity}`);
            setPopup(true);
          },
          (err) => { console.log(err); },
        );
      }}
    >
      <div className={styles.container}>
        <div>
          <h2>Add Inventory</h2>
        </div>
        <div className={styles.fields}>
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
              <input className={styles.check} type="checkbox" onChange={(e) => setWide(e.target.checked)} />
            </label>
          </div>
          <div>
            <label>
              <h4>Quantity</h4>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </label>
          </div>
        </div>
        <div className={styles.submitBtn}>
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
        message={popupMessage}
      />
      )}
      {inputForm}
    </div>
  );
}

export default NewShoeForm;
