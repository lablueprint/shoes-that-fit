import React, { useState, useEffect } from 'react';
import PageLengthForm from '../components/PageLengthForm';
import TableFooter from '../components/TableFooter';

// airtable configuration
const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

const calculateRange = (tableData, numRows) => {
  const range = [];
  const num = Math.ceil(tableData.length / numRows);
  for (let i = 1; i <= num; i += 1) {
    range.push(i);
  }
  return range;
};

// eslint-disable-next-line max-len
const sliceRows = (tableData, page, numRows) => tableData.slice((page - 1) * numRows, page * numRows);

function MainInventory() {
  const [rows, setRows] = useState([]);
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [numRows, setNumRows] = useState(10);

  const [slice, setSlice] = useState([]);
  const [tableRange, setTableRange] = useState([]);

  const getInventory = () => {
    base('Current Item Inventory (All Locations 1.3.2022)').select({ view: 'Grid view' }).all()
      .then((records) => {
        setRows(records);
      });
    setCategory('all');
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
        filteredProducts = filteredProducts.filter((item) => (item.fields.Quantity >= value));
      }
    }

    setItems(filteredProducts);
    const singleslice = sliceRows(items, page, numRows);
    setSlice([...singleslice]);

    const range = calculateRange(items, numRows);
    setTableRange(range);
  }, [category, value, rows, items, page, numRows, setSlice, setTableRange]);

  return (
    <>
      <PageLengthForm setNumRows={setNumRows} />
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
        {slice.map((row) => (
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
      <TableFooter range={tableRange} slice={slice} setPage={setPage} page={page} />
    </>
  );
}

export default MainInventory;
