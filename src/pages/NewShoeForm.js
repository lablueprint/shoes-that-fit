import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// import Popup from './Popup';
import styles from './NewShoeForm.module.css';

function NewShoeForm({ isLoggedIn, base }) {
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
          Message: `Added ${delta} ${(delta === 1) ? ('shoe') : ('shoes')} to inventory.`,
        },
      },
    ], (err) => {
      if (err) { console.log(err); }
    });
  }

  // const closePopup = () => setPopup(false);
  // base('TestInventory').select().all().then((records) => { records.forEach(cleanRecord); })

  const inputForm = (
    <form
      onSubmit={async (evt) => {
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

        await base('TestInventory').select({ filterByFormula: filter }).eachPage(
          async (records) => {
            if (records.length === 0) { // create a new record if there are no matching ones
              await base('TestInventory').create([
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
              setPopupMessage(`New Quantity: ${totalQuantity}`);
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
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Add Inventory</h1>
        </div>
        <div className={styles.fields}>
          <div className={styles.field}>
            <h4>Location</h4>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className={styles.field}>
            <h4>Part</h4>
            <input type="text" value={part} onChange={(e) => setPart(e.target.value)} />
          </div>
          <div className={styles.field}>
            <h4>Wide Width</h4>
            <input className={styles.check} type="checkbox" onChange={(e) => setWide(e.target.checked)} />
          </div>
          <div className={styles.field}>
            <h4>Quantity</h4>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
        </div>
        <div className={styles.submitForm}>
          <input
            value="Add to inventory"
            type="submit"
            className={styles.submitBtn}
          />
        </div>
        <div className={styles.message}>
          {popup
            ? <p className={success ? styles.success : styles.error}>{popupMessage}</p> : ''}

        </div>
      </div>
    </form>
  );

  return (
    !isLoggedIn
      ? (<Navigate to="/" />)
      : (
        <div className={styles.main}>
          {/* {popup && (
            <div>
              <Popup
                closePopup={closePopup}
                success={success}
                message={popupMessage}
              />
            </div>
          )} */}
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
