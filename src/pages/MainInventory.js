import React, { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
// import { base } from 'airlock-example/index.ts';
// import Airtable from '@calblueprint/airlock';
import PageLengthForm from '../components/PageLengthForm';
import TableFooter from '../components/TableFooter';

//*
// airtable configurationcs
const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({
  apiKey: airtableConfig.apiKey,
  endpointURL: 'http://localhost:3000',
})
  .base(airtableConfig.baseKey);
// */

/*
Airtable.configure({
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
  endpointURL: 'http://localhost:8000',
});

const base = Airtable.base(process.env.REACT_APP_AIRTABLE_BASE_KEY);
// */

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
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [quantityMin, setQuantityMin] = useState(0);
  const [quantityMax, setQuantityMax] = useState(null);
  const [updateFilter, setUpdateFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [numRows, setNumRows] = useState(10);
  const [slice, setSlice] = useState([]);
  const [tableRange, setTableRange] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState({
    'Client Name': [],
    'Location Name': [],
    'Bin Name': [],
    'Part Name': [],
    'Part Description': [],
    Quantity: [],
  });
  const [optionsSelected, setOptionsSelected] = useState({
    'Client Name': [],
    'Location Name': [],
    'Bin Name': [],
    'Part Name': [],
    'Part Description': [],
    Quantity: [],
  });
  const categories = ['Client Name', 'Location Name', 'Bin Name', 'Part Name', 'Part Description', 'Quantity'];
  const filterableCategories = ['Client Name', 'Location Name', 'Bin Name', 'Part Name', 'Part Description'];

  const getInventory = () => {
    base('Current Item Inventory (All Locations 1.3.2022)').select({ view: 'Grid view' }).all()
      .then((records) => {
        setRows(records);
      });
  };
  const createOptions = (category, optionList) => {
    categoryOptions[category] = optionList;
    setCategoryOptions(categoryOptions);
  };
  const handleOptionSelection = (e, category) => {
    optionsSelected[category] = e;
    setOptionsSelected(optionsSelected);
    setUpdateFilter(!updateFilter);
  };
  const handleQuantityFilterChange = (e, min) => {
    e.preventDefault();
    if (min) {
      setQuantityMin(e.target.value);
    } else {
      setQuantityMax(e.target.value);
    }
  };

  useEffect(getInventory, []);

  // Retrieves number of entries for each bin and
  useEffect(() => {
    categories.forEach((category) => {
      const counts = {};
      for (let i = 0; i < rows.length; i += 1) {
        counts[rows[i].fields[category]] = 1 + (counts[rows[i].fields[category]] || 0);
      }
      const optionList = [];
      Object.keys(counts).forEach((key) => optionList.push({
        value: key,
        label: key,
        // label: (`${key} - ${counts[key]}`),
      }));
      createOptions(category, optionList);
    });
  }, [rows]);

  // Applies a filter when a bin option is selected
  useEffect(() => {
    let filteredProducts = rows;
    filterableCategories.forEach((category) => {
      if (optionsSelected[category].length > 0) {
        filteredProducts = filteredProducts.filter((item) => {
          let include = false;
          optionsSelected[category].forEach((option) => {
            // eslint-disable-next-line max-len
            include = include || (String(item.fields[category]).toLowerCase()).localeCompare((String(option.value)).toLowerCase()) === 0;
          });
          return include;
        });
      }
    });
    // eslint-disable-next-line max-len
    filteredProducts = filteredProducts.filter((item) => item.fields.Quantity >= quantityMin && (!quantityMax || item.fields.Quantity <= quantityMax));
    setItems(filteredProducts);
  }, [quantityMin, quantityMax, optionsSelected, rows, updateFilter]);

  useEffect(() => {
    const singleslice = sliceRows(items, page, numRows);
    setSlice([...singleslice]);

    const range = calculateRange(items, numRows);
    setTableRange(range);
  }, [items, page, numRows, setSlice, setTableRange]);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < items.length; i += 1) {
      sum += (items[i].fields.Quantity || 0);
    }
    setInventoryTotal(sum);
  }, [items]);
  return (
    <>
      <PageLengthForm setNumRows={setNumRows} />
      <table>
        <thead>
          <tr>
            {filterableCategories.map((category) => (
              <th>
                {category}
                <ReactSelect
                  isMulti
                  onChange={(e) => handleOptionSelection(e, category)}
                  options={categoryOptions[category]}
                  placeholder={category}
                />
              </th>
            ))}
            <th>
              Quantity
              <form className="filter" onSubmit={(e) => e.preventDefault()}>
                Min
                <input type="number" onChange={(e) => handleQuantityFilterChange(e, true)} min="0" />
                <br />
                Max
                <input type="number" onChange={(e) => handleQuantityFilterChange(e, false)} min="0" />
              </form>
            </th>
          </tr>
        </thead>
        <tbody>
          {slice.map((row) => (
            <tr>
              {categories.map((category) => (
                <td>{row.fields[category]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={tableRange} slice={slice} setPage={setPage} page={page} />
      <span>
        {' '}
        Total Item Inventory:
        {' '}
        {inventoryTotal}
      </span>
    </>
  );
}

export default MainInventory;
