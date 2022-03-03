import React, { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
// import { base } from 'airlock-example/index.ts';
// import Airtable from '@calblueprint/airlock';

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

function MainInventory() {
  const [rows, setRows] = useState([]);
  const [items, setItems] = useState([]);
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [updateFilter, setUpdateFilter] = useState(false);
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
    setItems(filteredProducts);
  }, [optionsSelected, rows, updateFilter]);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < items.length; i += 1) {
      sum += (items[i].fields.Quantity || 0);
    }
    setInventoryTotal(sum);
  }, [items]);

  return (
    <>
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
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr>
              {categories.map((category) => (
                <td>{row.fields[category]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
