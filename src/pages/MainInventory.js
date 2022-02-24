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
  // const [c, setCategory] = useState('all');
  // const [v, setValue] = useState('');
  // const [binCounts, setBinCounts] = useState({});
  // const [binOptions, setBinOptions] = useState([]);
  const [inventoryTotal, setInventoryTotal] = useState(0);
  // const [binOptionsSelected, setBinOptionsSelected] = useState([]);
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
  // setCategoryOptions({
  //   'Client Name': [],
  //   'Location Name': [],
  //   'Bin Name': [],
  //   'Part Name': [],
  //   'Part Description': [],
  //   Quantity: [],
  // });
  // setOptionsSelected({
  //   'Client Name': [],
  //   'Location Name': [],
  //   'Bin Name': [],
  //   'Part Name': [],
  //   'Part Description': [],
  //   Quantity: [],
  // });

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
  // const handleFilterChange = (e, filterType) => {
  //   e.preventDefault();
  //   switch (filterType) {
  //     case 'category':
  //       setCategory(e.target.value);
  //       break;
  //     case 'value':
  //       setValue(e.target.value);
  //       break;
  //     default: break;
  //   }
  // };
  // const handleSubmission = (e) => {
  //   e.preventDefault();
  // };

  useEffect(getInventory, []);

  // Retrieves number of entries for each bin and
  // Processes the binCounts into a list of options to be selected on the frontend
  useEffect(() => {
    categories.forEach((category) => {
      const counts = {};
      for (let i = 0; i < rows.length; i += 1) {
        counts[rows[i].fields[category]] = 1 + (counts[rows[i].fields[category]] || 0);
      }
      const optionList = [];
      Object.keys(counts).forEach((key) => optionList.push({
        value: key,
        label: (`${key} - ${counts[key]}`),
      }));
      createOptions(category, optionList);
    });
  }, [rows]);

  // useEffect(() => {
  //   let filteredProducts = rows;
  //   if (v !== '') {
  //     if (c !== 'all' && c !== 'Quantity') {
  // eslint-disable-next-line max-len
  //       filteredProducts = filteredProducts.filter((item) => (String(item.fields[c]).toLowerCase()).includes((String(v)).toLowerCase()));
  //     } else if (c === 'Quantity') {
  //       // eslint-disable-next-line max-len
  //       filteredProducts = filteredProducts.filter((item) => (item.fields.Quantity >= v));
  //     }
  //   }
  //   // console.log(filteredProducts);
  //   setItems(filteredProducts);
  // }, [c, v, rows]);

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
      {/* <div>
        <form className="filter" onSubmit={(e) => handleSubmission(e)}>
          <select name="category" id="category" onChange={(e) => handleFilterChange(e, 'category')}>
            <option value="all">All</option>
            {categories.map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
    <input name="value" onChange={(e) => handleFilterChange(e, 'value')} placeholder="Search For" />
        </form>
      </div> */}
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
