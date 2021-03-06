/* eslint-disable no-unused-vars */
import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import ReactSelect from 'react-select';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TableFooter, PageLengthForm } from '../components';
import styles from './MainInventory.module.css';

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

function MainInventory({
  isLoggedIn, username, base,
}) {
  console.log(isLoggedIn);
  console.log(username);

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
    base('InventoryTestRevamp').select({ view: 'Grid view' }).all().then((records) => {
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
    getInventory();
  }, []);

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
    // eslint-disable-next-line max-len
    // filteredProducts = filteredProducts.filter((item) => item.fields.Quantity >= quantityMin && (!quantityMax || item.fields.Quantity <= quantityMax));
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
    !isLoggedIn
      ? (<Navigate to="/" />)
      : (
        <>
          <PageLengthForm setNumRows={setNumRows} />
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" onChange={() => updateAllRows()} />
                </th>
                {filterableCategories.map((category) => (
                  <th key={category}>
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
                      <input type="checkbox" className={index} onClick={(e) => removeRowStatus(e)} checked={selectedRows.includes(index) || allChecked} />
                      {categories.map((category) => {
                        if (category === 'Quantity') {
                          return (
                            <td className={index} contentEditable="true" id="editableQuantity" suppressContentEditableWarning>{row.fields[category]}</td>
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
      )
  );
}

export default MainInventory;

MainInventory.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  base: PropTypes.func.isRequired,
};
