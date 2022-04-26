import React, {
  useRef, useState, useEffect, useCallback,
} from 'react';
import ReactSelect from 'react-select';
// import base from '../lib/airtable';
import { TableFooter, PageLengthForm } from '../components';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({
  apiKey: airtableConfig.apiKey,
  endpointURL: 'http://localhost:3000',
}).base(airtableConfig.baseKey);

// const loginUser = async (email, password) => {
//   try {
//     const res = await base.login({ username: email, password });
//     if (!res.body.success) {
//       return { match: false, found: false };
//     }
//     return { match: true, found: true };
//   } catch (err) {
//     if (err.error === 'AUTHENTICATION_REQUIRED') {
//       return { match: false, found: true };
//     }
//     return { match: false, found: false };
//   }
// };

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
  const [allChecked, setAllChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [quantityMin, setQuantityMin] = useState(0);
  const [quantityMax, setQuantityMax] = useState(null);
  const [updateFilter, setUpdateFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [numRows, setNumRows] = useState(10);
  const [slice, setSlice] = useState([]);
  const [highlightedRow, setHighlightedRow] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableRange, setTableRange] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState({
    'Location Name': [],
    'Part Name': [],
    Quantity: [],
  });
  const [optionsSelected, setOptionsSelected] = useState({
    'Location Name': [],
    'Part Name': [],
    Quantity: [],
  });
  const categories = ['Location Name', 'Part Name', 'Quantity'];
  const filterableCategories = ['Location Name', 'Part Name'];
  // eslint-disable-next-line no-unused-vars
  const tableContents = useRef(); // For setting/ unsetting navigation
  const inputBoxes = useRef();
  const getInventory = () => {
    // base('Current Item Inventory (All Locations 1.3.2022)').select({ view: 'Grid view' }).all()
    base('InventoryTestRevamp').select({ view: 'Grid view' }).all()
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

  const handleKeyDown = useCallback((e) => {
    const { key } = e;
    switch (key) {
      case 'ArrowUp':
        // Move up a row
        if (highlightedRow === -1) {
          setHighlightedRow(0);
        } else if (highlightedRow > 0) {
          setHighlightedRow((currHRow) => (currHRow - 1));
        }
        break;
      case 'ArrowDown':
        // Move down a row
        if (highlightedRow === -1) {
          setHighlightedRow(0);
        } else if (highlightedRow < slice.length - 1) {
          setHighlightedRow((currHRow) => (currHRow + 1));
        }
        break;
      default:
        break;
    }
  }, [highlightedRow]);
  const editTableEntryQuantity = ((val, index) => {
    const row = items[(page - 1) * numRows + index];
    if (!(/^\d+$/.test(val))) {
      console.error('Invalid Input: Quantity should be a number');
      return;
    }
    base('table editing test').update([
      {
        id: row.id,
        fields: {
          Quantity: parseInt(val, 10),
        },
      },
    ], (err, records) => {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach((record) => {
        console.log(`Edited entry at row ${(page - 1) * numRows + index}: ${record.get('Client Name')}, ${record.get('Location Name')}, ${record.get('Bin Name')}, ${record.get('Part Name')}, ${record.get('Part Description')}`);
      });
    });
  });

  const handleMouseDown = useCallback(
    (e) => {
      if (tableContents.current && tableContents.current.contains(e.target)) {
        if ((e.target.className) <= numRows) {
          setHighlightedRow(parseInt(e.target.className, 10));
          console.log(highlightedRow);
        }
      } else {
        // console.log(typeof e.target.className);
      }
    },
    [tableContents, highlightedRow],
  );

  useEffect(() => {
    // eslint-disable-next-line max-len
    // console.log(loginUser(process.env.REACT_APP_AIRTABLE_EMAIL, process.env.REACT_APP_AIRTABLE_PASSWORD));
  }, []);

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
    filteredProducts = filteredProducts.filter((item) => {
      let include = true;
      filterableCategories.forEach((category) => {
        if (optionsSelected[category].length > 0) {
          let satisfiesCategory = false;
          optionsSelected[category].forEach((option) => {
            // eslint-disable-next-line max-len
            satisfiesCategory = satisfiesCategory || (String(item.fields[category])).localeCompare((String(option.value))) === 0;
          });
          include = include && satisfiesCategory;
        }
      });
      // eslint-disable-next-line max-len
      include = include && (item.fields.Quantity >= quantityMin && (!quantityMax || item.fields.Quantity <= quantityMax));
      return include;
    });
    setItems(filteredProducts);
  }, [quantityMin, quantityMax, optionsSelected, rows, updateFilter]);

  useEffect(() => {
    const singleslice = sliceRows(items, page, numRows);
    setSlice([...singleslice]);
    setHighlightedRow(-1);

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
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  useEffect(() => {
    const quantityTDElement = document.getElementById('editableQuantity');
    if (!quantityTDElement) {
      // console.log('Waiting for selected row');
      return null;
    }
    quantityTDElement.addEventListener('input', () => {
      editTableEntryQuantity(quantityTDElement.innerHTML, highlightedRow);
    });
    return () => {
      quantityTDElement.removeEventListener('input', () => {
        editTableEntryQuantity(quantityTDElement.innerHTML, highlightedRow);
      });
    };
  });

  const updateRowStatus = (e) => {
    setSelectedRows([...selectedRows, parseInt(e.target.className, 10)]);
    console.log(selectedRows);
  };

  const removeRowStatus = (e) => {
    const newRows = selectedRows.filter((index) => index !== parseInt(e.target.className, 10));
    setSelectedRows(newRows);
  };

  const updateAllRows = () => {
    if (allChecked) { setSelectedRows([]); setAllChecked(false); } else { setAllChecked(true); }
  };

  return (
    <>
      <PageLengthForm setNumRows={setNumRows} />
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" className={setNumRows} onChange={() => updateAllRows()} />
            </th>
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
        <tbody ref={tableContents}>
          {slice.map((row, index) => {
            if (selectedRows.includes(index) || allChecked) {
              return (
                <tr className={index} style={{ color: 'red' }}>
                  <input type="checkbox" className={index} id={index} onClick={(e) => removeRowStatus(e)} checked={selectedRows.includes(index) || allChecked} />
                  {categories.map((category) => {
                    if (category === 'Quantity') {
                      return (
                        <td className={index} contentEditable="true" id="editableQuantity">{row.fields[category]}</td>
                      );
                    }
                    return (
                      <td className={index}>{row.fields[category]}</td>
                    );
                  })}
                </tr>
              );
            }
            return (
              <tr className={index}>
                <input type="checkbox" ref={inputBoxes} className={index} onClick={(e) => updateRowStatus(e)} checked={selectedRows.includes(index) || allChecked} />
                {categories.map((category) => (
                  <td className={index} classID="tableData">{row.fields[category]}</td>

                ))}
              </tr>
            );
          })}
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
