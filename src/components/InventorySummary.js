import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './InventorySummaryDashboard.module.css';

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

function InventorySummary() {
  // eslint-disable-next-line no-unused-vars
  const [rows, setRows] = useState([]);
  const [quantityFulfilled, setQuantityFulfilled] = useState(0);

  const getQuantityFulfilled = () => {
    let quantity = 0;
    for (let i = 0; i < rows.length; i += 1) {
      quantity += (rows[i].fields.Size || 0);
      // console.log(rows[i].fields.Size);
    }
    setQuantityFulfilled(quantity);
  };

  const getOrders = () => {
    base('Orders').select({
      view: 'Grid view',
      filterByFormula: `SEARCH("${'y'}",{Active})`,
    }).all()
      .then((records) => {
        setRows(records);
      });
  };

  useEffect(getOrders, []);
  useEffect(getQuantityFulfilled, [rows]);

  // console.log(rows.length);
  return (
    <>
      <div>
        <div className={styles.das}>
          <h1 className="title">Inventory</h1>
        </div>
        <div className="link">
          <Link to="/inventory">See Full Inventory</Link>
        </div>
      </div>

      <div>
        <h3>Total Quantity Fullfilled</h3>
        <p>{rows.length}</p>
        <h3>Quantity Shipped</h3>
        <p>{quantityFulfilled}</p>

      </div>
    </>
  );
}

export default InventorySummary;
