import React, { useState, useEffect } from 'react';
import base from '../lib/airtable';
// airtable configuration
// const Airtable = require('airtable');

// const airtableConfig = {
//   apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
//   baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
// };

// const base = new Airtable({ apiKey: airtableConfig.apiKey })
//   .base(airtableConfig.baseKey);

const loginUser = async (email, password) => {
  try {
    const res = await base.login({ username: email, password });
    if (!res.body.success) {
      return { match: false, found: false };
    }
    return { match: true, found: true };
  } catch (err) {
    if (err.error === 'AUTHENTICATION_REQUIRED') {
      return { match: false, found: true };
    }
    return { match: false, found: false };
  }
};

function MainInventory() {
  console.log(base);
  const [rows, setRows] = useState([]);
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [value, setValue] = useState('');
  const getInventory = () => {
    base('Current Item Inventory (All Locations 1.3.2022)').select({ view: 'Grid view' }).all()
      .then((records) => {
        setRows(records);
      });
  };
  const handleFilterChange = (e, filterType) => {
    e.preventDefault();
    switch (filterType) {
      case 'category':
        setCategory(e.target.value);
        break;
      case 'value':
        setValue(e.target.value);
        break;
      default: break;
    }
  };
  const handleSubmission = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    // eslint-disable-next-line max-len
    console.log(loginUser(process.env.REACT_APP_AIRTABLE_EMAIL, process.env.REACT_APP_AIRTABLE_PASSWORD));
  }, []);

  useEffect(getInventory, []);
  useEffect(() => {
    let filteredProducts = rows;
    if (value !== '') {
      if (category !== 'all' && category !== 'Quantity') {
        // eslint-disable-next-line max-len
        filteredProducts = filteredProducts.filter((item) => (String(item.fields[category]).toLowerCase()).includes((String(value)).toLowerCase()));
      } else if (category === 'Quantity') {
        // eslint-disable-next-line max-len
        filteredProducts = filteredProducts.filter((item) => (item.fields.Quantity >= value));
      }
    }
    console.log(filteredProducts);
    setItems(filteredProducts);
  }, [category, value, rows]);

  return (
    <>
      <div>
        <form className="filter" onSubmit={(e) => handleSubmission(e)}>

          <select name="category" id="category" onChange={(e) => handleFilterChange(e, 'category')}>
            <option value="all">All</option>
            <option value="Client Name">Client Name</option>
            <option value="Location Name">Location Name</option>
            <option value="Bin Name">Bin Name</option>
            <option value="Part Name">Part Name</option>
            <option value="Part Description">Part Description</option>
            <option value="Quantity">Quantity</option>

          </select>
          <input name="value" onChange={(e) => handleFilterChange(e, 'value')} placeholder="Search For" />
        </form>
      </div>
      <table>
        <tr>
          <th>Client</th>
          <th>Location</th>
          <th>Bin</th>
          <th>Part Name</th>
          <th>Part Description</th>
          <th>Quantity</th>
        </tr>
        {items.map((row) => (
          <tr>
            <td>{row.fields['Client Name']}</td>
            <td>{row.fields['Location Name']}</td>
            <td>{row.fields['Bin Name']}</td>
            <td>{row.fields['Part Name']}</td>
            <td>{row.fields['Part Description']}</td>
            <td>{row.fields.Quantity}</td>
          </tr>
        ))}
      </table>
    </>
  );
}

export default MainInventory;
