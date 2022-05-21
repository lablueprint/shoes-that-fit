/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AddOrders.module.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

// eslint-disable-next-line no-unused-vars
const base = new Airtable({
  apiKey: airtableConfig.apiKey,
  endpointURL: 'http://localhost:3000',
})
  .base(airtableConfig.baseKey);

function AddOrders() {
  const [added, setAdded] = useState(false);

  const submitForm = ((e) => {
    e.preventDefault();

    console.log(e);

    const PName = e.target.form[0].value;
    const Location = e.target.form[2].value;
    const Wide = e.target.form[1].value === 'on' ? true : 1;
    const Quant = parseInt(e.target.form[3].value, 10);
    base('LargerTestInventory').create([
      {
        fields: {
          'Part Name': PName,
          'Bin Name': Location,
          'Wide Width': Wide,
          Quantity: Quant,
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
    alert('You have successfully added to the inventory');
    document.getElementById('form').reset();
  });

  return (
    <div>
      <div className={styles.header}>
        <div>
          <Link to="/inventory" style={{ textDecoration: 'none', color: 'black' }}>
            <h1>&lt;</h1>
          </Link>
        </div>
        <div>
          <h1>Add Inventory</h1>
        </div>
      </div>

      <form id="form">
        <div className={styles.formRow}>
          <div className={styles.formPart}>
            <label htmlFor="PartName">Part Name:</label>
            <input type="text" id="PartName" />
          </div>

          <div className={styles.formPart}>
            <label htmlFor="Wide">Wide Width?</label>
            <input type="checkbox" id="Wide" />
          </div>

          <div className={styles.formPart}>
            <label htmlFor="BinName">Bin Name:</label>
            <input type="text" id="BinName" />
          </div>

          <div className={styles.formPart}>
            <label htmlFor="Quantity">Quantity:</label>
            <input type="number" id="Quantity" />
          </div>

        </div>
        <input type="submit" value="Submit" onClick={(e) => submitForm(e)} />
      </form>

    </div>
  );
}

export default AddOrders;
