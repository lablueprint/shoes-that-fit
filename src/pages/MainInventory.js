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

// function Option(props) {
//   return (
//     <div>
//       <components.Option {...props}>
//         <input
//           type="checkbox"
//           checked={props.isSelected}
//           onChange={() => null}
//         />
//         {' '}
//         { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
//         <label>{props.label}</label>
//       </components.Option>
//     </div>
//   );
// }
function MainInventory() {
  const [rows, setRows] = useState([]);
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [value, setValue] = useState('');
  const [binCounts, setBinCounts] = useState({});
  const [binOptions, setBinOptions] = useState([]);
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [binOptionsSelected, setBinOptionsSelected] = useState([]);
  // const [expanded, setExpanded] = useState(false);
  // const [partCounts, setPartCounts] = useState({});

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
  useEffect(() => {
    console.log(binOptionsSelected);
    let filteredProducts = rows;
    if (binOptionsSelected.length !== null && binOptionsSelected.length > 0) {
      filteredProducts = filteredProducts.filter((item) => {
        let include = false;
        console.log(String(item.fields['Bin Name']).toLowerCase());
        binOptionsSelected.forEach((option) => {
          console.log(option.value);
          // eslint-disable-next-line max-len
          include = include || (String(item.fields['Bin Name']).toLowerCase()).includes((String(option.value)).toLowerCase());
        });
        // eslint-disable-next-line max-len
        console.log(include);
        return include;
      });
    }
    console.log(filteredProducts);
    setItems(filteredProducts);
  }, [binOptionsSelected]);
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
        filteredProducts = filteredProducts.filter((item) => (item.fields.Quantity >= value));
      }
    }
    // console.log(filteredProducts);
    setItems(filteredProducts);
  }, [category, value, rows]);

  useEffect(() => {
    const counts = {};
    for (let i = 0; i < rows.length; i += 1) {
      counts[rows[i].fields['Bin Name']] = 1 + (counts[rows[i].fields['Bin Name']] || 0);
    }
    setBinCounts(counts);
  }, [rows]);

  useEffect(() => {
    const optionList = [];
    Object.keys(binCounts).forEach((key) => optionList.push({
      value: key,
      label: (`${key} - ${binCounts[key]}`),
    }));
    setBinOptions(optionList);
  }, [binCounts]);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < items.length; i += 1) {
      sum += (items[i].fields.Quantity || 0);
    }
    setInventoryTotal(sum);
  }, [items]);

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
        <thead>
          <th>Client</th>
          <th>Location</th>
          <th>
            Bin
            <ReactSelect
              isMulti
              defaultValue={binOptionsSelected}
              onChange={setBinOptionsSelected}
              options={binOptions}
            />
          </th>
          <th>Part Name</th>
          <th>Part Description</th>
          <th>Quantity</th>
        </thead>
        <tbody>
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
