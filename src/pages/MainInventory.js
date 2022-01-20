import React, { useState, useEffect } from 'react';

// airtable configuration
const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function MainInventory() {
  const [rows, setRows] = useState([]);
  const [items, setItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [category, setCategory] = useState('all');
  const [value, setValue] = useState('');

  const getInventory = () => {
    base('Current Item Inventory (All Locations 1.3.2022)').select({ view: 'Grid view' }).all()
      .then((records) => {
        setRows(records);
      });
    // setRows([
    //   {
    //     id: 'recdSsNu3GksmtYY0',
    //     fields: {
    //       'Client Name': 'Shoes That Fit Warehouse',
    //       'Location Name': 'STF Warehouse',
    //       'Bin Name': 'Area 51',
    //       'Part Name': 'B1',
    //       'Part Description': 'B1',
    //       Quantity: 78,
    //     },
    //     createdTime: '2022-01-13T04:35:45.000Z',
    //   },
    //   {
    //     id: 'recBDHujkX5A8zeCb',
    //     fields: {
    //       'Client Name': 'Shoes That Fit Warehouse',
    //       'Location Name': 'STF Warehouse',
    //       'Bin Name': 'Area 51',
    //       'Part Name': 'B1.5',
    //       'Part Description': 'B1.5',
    //       Quantity: 69,
    //     },
    //     createdTime: '2022-01-13T04:35:45.000Z',
    //   },
    //   {
    //     id: 'recexWd0kcC0GMXXl',
    //     fields: {
    //       'Client Name': 'Shoes That Fit Warehouse',
    //       'Location Name': 'STF Warehouse',
    //       'Bin Name': 'Area 51',
    //       'Part Name': 'B10',
    //       'Part Description': 'B10',
    //       Quantity: 24,
    //     },
    //     createdTime: '2022-01-13T04:35:45.000Z',
    //   },
    // ]);
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

  useEffect(getInventory, []);
  useEffect(() => {
    let filteredProducts = rows;
    if (value !== '') {
      if (category !== 'all' && category !== 'Quantity') {
        // eslint-disable-next-line max-len
        filteredProducts = filteredProducts.filter((item) => (String(item.fields[category]).toLowerCase()).includes((String(value)).toLowerCase()));
      } else if (category === 'Quantity') {
        // eslint-disable-next-line max-len
        filteredProducts = filteredProducts.filter((item) => (String(item.fields.Quantity).toLowerCase()).includes(String(value)));
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
