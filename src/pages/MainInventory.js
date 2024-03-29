/* eslint-disable react/button-has-type */
/* eslint-disable no-loop-func */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { Link, Navigate } from 'react-router-dom';
// import ReactSelect from 'react-select';
import {
  Pencil, Trash2,
} from 'lucide-react';
import PropTypes from 'prop-types';
import {
  Table, ActionPopup,
} from '../components';
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
  isLoggedIn, base,
}) {
  // console.log(isLoggedIn);
  // console.log(username);
  const [selected, setSelected] = useState([]);
  const [editable, setEditable] = useState(false);
  const [rows, setRows] = useState([]);
  const [cards, setCards] = useState([]);
  const [tableInfo, setTableInfo] = useState([]);
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
    'Bin Name': [],
    'Part Name': [],
    Quantity: [],
  });
  const [optionsSelected, setOptionsSelected] = useState({
    'Bin Name': [],
    'Part Name': [],
    Quantity: [],
  });

  const [popup, setPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const categories = ['Bin Name', 'Part Name', 'Quantity'];
  const filterableCategories = ['Bin Name', 'Part Name'];
  // eslint-disable-next-line no-unused-vars
  const tableContents = useRef(); // For setting/ unsetting navigation
  const inputBoxes = useRef();
  const getInventory = () => {
    // base('Current Item Inventory (All Locations 1.3.2022)').select({ view: 'Grid view' }).all()
    base('LargerTestInventory').select({ view: 'Grid view' }).all().then((records) => {
      setRows(records);
      setCards(records.map((r) => {
        const record = r.fields;

        let partExpr;
        let quantityExpr;
        let partsort;
        if (record['Wide Width'] === true) {
          partsort = `${record['Part Name']}W`;
          partExpr = (
            <div className={styles.table}>
              <p>
                {`${record['Part Name']} `}
              </p>
              &nbsp;
              <p className={styles.WStyling}>
                W
              </p>
            </div>
          );
        } else {
          partsort = record['Part Name'];
          partExpr = (
            <div>
              {record['Part Name']}
            </div>
          );
        }
        if (record.Quantity < 5) {
          quantityExpr = (
            <div className={styles.table}>
              <div>
                {record.Quantity}
                &nbsp; LOW
              </div>
              {/* &nbsp;
                &nbsp; */}
              {/* <div>
                <AlertTriangle color="black" className={styles.caution} />
              </div> */}
              {/* <div>
                <AlertTriangle color="#000000" className={styles.caution} />
                &nbsp; LOW
              </div> */}
            </div>
          );
        } else {
          quantityExpr = (
            <div>
              {record.Quantity}
            </div>
          );
        }
        const Part = {
          sortBy: partsort,
          fragment: partExpr.props.children,
        };
        const Quantity = {
          sortBy: record.Quantity,
          fragment: quantityExpr.props.children,
        };
        console.log(React.isValidElement(Part.fragment));
        // console.log(Part.fragment.props.children === partExpr.props.children);
        return {
          'Bin Name': record['Bin Name'], 'Part Name': Part, Quantity, id: r.id,
        };
      }));
    });
  };
  const sortIndices = [0, 1, 2];
  const headers = ['Bin Name', 'Part Name', 'Quantity'];
  const dataProps = ['Bin Name', 'Part Name', 'Quantity', 'id'];
  const dataKeyProp = 'id';

  const [headerInfo, setheaderInfo] = useState([]);
  const [quantityFulfilled, setQuantityFulfilled] = useState(0);

  const getQuantityFulfilled = () => {
    let quantity = 0;
    for (let i = 0; i < headerInfo.length; i += 1) {
      if (headerInfo[i].fields.Active === true) {
        const arr = headerInfo[i].fields.Orders.split('},{');
        quantity += (arr.length || 0);
      }
    }
    setQuantityFulfilled(quantity);
  };

  const updateSelectedItems = (id, command) => {
    if (command === 0) { // add item
      setSelected((prev) => [...prev, id]);
    } else if (command === 1) { // remove item
      setSelected((prev) => (prev.filter((index) => index !== id)));
    }
  };

  const getOrders = () => {
    base('Orders').select({
      view: 'Grid view',
    }).all()
      .then((records) => {
        setheaderInfo(records);
      });
  };

  useEffect(getOrders, []);
  useEffect(getQuantityFulfilled, [headerInfo]);

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
        console.log(`Edited entry at row ${(page - 1) * numRows + index}: ${record.get('Client Name')}, ${record.get('Bin Name')}, ${record.get('Bin Name')}, ${record.get('Part Name')}, ${record.get('Part Description')}`);
      });
    });
  });

  const removeItems = (() => {
    let i = 0;
    for (i; i < selected.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      console.log(selected[i]);
      base('LargerTestInventory').destroy([selected[i]], (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    setCards((prev) => (prev.filter((index) => !selected.includes(index.id))));
    setSuccess(true);
    setPopupMessage(`You have deleted ${selected.length} items!`);
    setSelected([]);
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
    if (isLoggedIn) {
    // eslint-disable-next-line max-len
    //  console.log(loginUser(process.env.REACT_APP_AIRTABLE_EMAIL, process.env.REACT_APP_AIRTABLE_PASSWORD));
    }
  }, []);

  useEffect(getInventory, []);
  const processInventory = () => {
    if (cards.length === 0) { return; }
    const arr = [];
    for (let i = 0; i < cards.length; i += 1) {
      const Bin = cards[i]['Bin Name'];
      let Part;
      let Quantity;
      if (cards[i]['Wide Width'] === true) {
        Part = (
          <div>
            {`${cards[i]['Part Name']} W`}
          </div>
        );
      } else {
        Part = (
          <div>
            {cards[i]['Part Name']}
          </div>
        );
      }
      if (cards[i].Quantity < 5) {
        Quantity = (
          <div>
            {`${cards[i].Quantity} LOW`}
          </div>
        );
      } else {
        Quantity = (
          <div>
            {cards[i].Quantity}
          </div>
        );
      }
      const elem = { 'Bin Name': Bin, 'Part Name': Part.props.children, Quantity };
      arr.push(elem);
    }
    setTableInfo(arr);
  };

  useEffect(processInventory, [cards]);

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

  const editTableEntry = ((e, id, header) => {
    let val = e.currentTarget.textContent;
    val = val.trim();
    const wide = 'Wide Width';
    if (header === 'Quantity') {
      base('LargerTestInventory').update([
        {
          id,
          fields: {
            Quantity: parseInt(val, 10),
          },
        },
      ], (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    if (header === 'Part Name') {
      if (val.charAt(val.length - 1) === 'W') {
        const str = val.slice(0, -1);
        base('LargerTestInventory').update([
          {
            id,
            fields: {
              [header]: str,
              [wide]: true,
            },
          },
        ], (err) => {
          if (err) {
            console.error(err);
          }
        });
      } else {
        base('LargerTestInventory').update([
          {
            id,
            fields: {
              'Bin Name': val,
            },
          },
        ], (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    }
  });

  const startPopup = (() => {
    setSuccess(false);
    setPopupMessage(`Are you sure you want to remove ${selected.length} items?`);
    setPopup(true);
  });

  const closePopup = () => setPopup(false);
  return (
    !isLoggedIn
      ? (<Navigate to="/" />)
      : (
        <div>
          {popup && (
          <ActionPopup
            closePopup={closePopup}
            success={success}
            message={popupMessage}
            applyFunc={removeItems}
          />
          )}
          <div className={styles.heading}>
            <h1 className={styles.header}>Inventory</h1>
          </div>

          {/* <div className={styles.headers}>

            <div className={styles.iconBox}>
              <Box color="#6BB7E8" className={styles.icon} />
              <h3 className={styles.iconTitle}>Total Quantity</h3>
              <p>{inventoryTotal}</p>
            </div>
            <div>
              <Smile color="#D66330" className={styles.icon} />
              <h3>Kids Helped</h3>
              <p>{quantityFulfilled}</p>
            </div>
          </div> */}
          <div>
            <Link to="/newshoeform">
              {/* <Plus color="#6BB7E8" className={styles.tableIcon} /> */}
              <button className={styles.addButton}>+ Add Inventory</button>
            </Link>
            <Pencil color="gray" className={styles.pencilIcon} onClick={() => setEditable(!editable)} />
            <Trash2 color="gray" className={styles.tableIcon} onClick={() => startPopup()} />
          </div>
          <Table
            editable={editable}
            headers={headers}
            sortIndices={sortIndices}
            data={cards}
            dataProps={dataProps}
            dataKeyProp={dataKeyProp}
            selected={selected}
            setSelected={updateSelectedItems}
            editFunction={editTableEntry}
          />
        </div>
      )
  );
}

export default MainInventory;

MainInventory.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  base: PropTypes.func.isRequired,
};
