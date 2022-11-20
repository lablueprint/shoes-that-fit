/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { Info } from 'lucide-react';
// eslint-disable-next-line import/no-cycle
import { TableFooter, PageLengthForm } from './index';
// import { PageLengthForm } from './PageLengthForm';
import styles from './table.module.css';
import detailsIcon from '../assets/DetailsIcon.svg';

const sorts = {
  descending: 0,
  ascending: 1,
};

const calculateRange = (tableData, numRows) => {
  const range = [];
  const num = Math.ceil(tableData.length / numRows);
  for (let i = 1; i <= num; i += 1) {
    range.push(i);
  }
  return range;
};

const sliceRows = (tableData, page, numRows) => tableData.slice((page - 1) * numRows, page * numRows);

export default function Table({
  editable, headers, sortIndices, data, dataProps, checkbox, dataKeyProp, selected, setSelected, editFunction, selectCard, details, modify, modifyFuncs,
}) {
  const [lastIndex, setLast] = useState(0);
  const [sortDir, setDir] = useState(sorts.descending);
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(1);
  const [numRows, setNumRows] = useState(10);
  const [slice, setSlice] = useState([]);
  const [tableRange, setTableRange] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  function sortData(index, dir) {
    // sorts by sortIndex, defaults to sorting by left-most column values
    if (dataProps.length > 0) {
      data.sort((a, b) => {
        if (typeof a[dataProps[index]] === 'string') {
          return a[dataProps[index]].localeCompare(b[dataProps[index]]);
        }

        if (typeof a[dataProps[index]] === 'boolean') {
          if (a === b) {
            return 0;
          }

          return a ? -1 : 0;
        }

        if (typeof a[dataProps[index]] === 'object') {
          if ('sortBy' in a[dataProps[index]]) {
            if (typeof a[dataProps[index]].sortBy === 'string') {
              return a[dataProps[index]].sortBy.localeCompare(b[dataProps[index]].sortBy);
            }

            if (typeof a[dataProps[index]] === 'boolean') {
              if (a[dataProps[index]].sortBy === b[dataProps[index]].sortBy) {
                return 0;
              }
              return a[dataProps[index]].sortBy ? -1 : 0;
            }

            if (a[dataProps[index]].sortBy > b[dataProps[index]].sortBy) return 1;
            if (a[dataProps[index]].sortBy < b[dataProps[index]].sortBy) return -1;
          }
        }

        return 0;
      });
    } else {
      data.sort((a, b) => a[headers[index]].localeCompare(b[headers[index]]));
    }

    if (dir) {
      data.reverse();
    }

    setReady(true);
    const singleslice = sliceRows(data, page, numRows);
    setSlice([...singleslice]);

    const range = calculateRange(data, numRows);
    setTableRange(range);
  }

  const updateSelectedItems = ((e, id) => {
    setAllChecked(false);
    if (e.target.checked === true) {
      setSelected(id, 0);
    } else {
      setSelected(id, 1);
    }
  });

  const updateAllChecked = ((e) => {
    let i = 0;
    setAllChecked(!allChecked);
    for (i = 0; i < data.length; i += 1) {
      if (e.target.checked === true) {
        setSelected(data[i].id, 0);
      } else {
        setSelected(data[i].id, 1);
      }
    }
  });

  useEffect(() => {
    sortData(0, sorts.descending);
  }, []);

  useEffect(() => {
    const singleslice = sliceRows(data, page, numRows);
    setSlice([...singleslice]);

    const range = calculateRange(data, numRows);
    setTableRange(range);
  }, [data, page, numRows, setSlice, setTableRange]);

  return (
    ready && (
      <div className={styles.top}>
        <div className={styles.pageLength}>
          <PageLengthForm setNumRows={setNumRows} />
          {numRows < data.length && (
            <TableFooter range={tableRange} slice={slice} setPage={setPage} page={page} className={styles.Footer} onClick={() => setPage(page)} />
          )}
        </div>
        <div className={styles.container}>

          {checkbox && (
          <div className={styles.checkboxColumn}>
            <header className={styles.cellContainer}>
              <div className={styles.cell}>
                <input type="checkbox" checked={allChecked} onClick={(e) => updateAllChecked(e)} className={styles.checkbox} />
              </div>
            </header>
            {slice.map((d, dIndex) => (
              <div
                key={d[dataKeyProp]}
                className={styles.cellContainer}
                style={dIndex % 2 === 0 ? {
                  backgroundColor: '#F6F6F6',
                } : { backgroundColor: '#FFFFFF' }}
              >
                <div className={styles.cell}>
                  <input type="checkbox" onClick={(e) => updateSelectedItems(e, d.id)} checked={allChecked || selected.includes(d.id)} className={styles.checkbox} />
                </div>
              </div>
            ))}
          </div>
          )}
          {headers.map((h, hIndex) => (
            <div key={h}>
              <header className={styles.cellContainer}>
                <div className={styles.cell}>
                  {sortIndices && (sortIndices.length === 0 || sortIndices.includes(hIndex)) ? (
                    <button
                      className={styles.sortButton}
                      type="button"
                      onClick={() => {
                        if (hIndex === lastIndex) {
                          const dir = sortDir === sorts.ascending ? sorts.descending : sorts.ascending;
                          sortData(hIndex, dir);
                          setDir(dir);
                        } else {
                          sortData(hIndex, sorts.descending);
                          setLast(hIndex);
                          setDir(sorts.descending);
                        }
                      }}
                    >
                      <p>{h}</p>
                      {/* Ascending = sortDir = arrow shows pointing up */}
                      <div>
                        {lastIndex === hIndex && (
                          sortDir === sorts.ascending
                            ? <FontAwesomeIcon icon={faAngleUp} />
                            : <FontAwesomeIcon icon={faAngleDown} />)}
                        {lastIndex !== hIndex && <FontAwesomeIcon icon={faCircle} transform="shrink-8" />}
                      </div>
                    </button>
                  )
                    : <p>{h}</p>}
                </div>
              </header>
              {slice.map((d, dIndex) => (
                <div
                  key={d[dataKeyProp]}
                  className={styles.cellContainer}
                  style={dIndex % 2 === 0 ? {
                    backgroundColor: '#F6F6F6',
                  } : { backgroundColor: '#FFFFFF' }}
                >
                  {!editable && dataProps.length > 0 && (typeof (d[dataProps[hIndex]]) === 'object'
                    ? <div className={styles.cell}>{d[dataProps[hIndex]].fragment}</div>
                    : <p className={styles.cell}>{d[dataProps[hIndex]]}</p>)}
                  {!editable && dataProps.length === 0 && (typeof (d[dataProps[hIndex]]) === 'object'
                    ? <div className={styles.cell}>{d[headers[hIndex]]}</div>
                    : <p lassName={styles.cell}>{d[headers[hIndex]]}</p>)}
                  {/* {!editable && dataProps.length > 0 && typeof} */}

                  {editable && dataProps.length > 0 && (typeof (d[dataProps[hIndex]]) === 'object'
                    ? <div onInput={(e) => editFunction(e, data[dIndex].id, dataProps[hIndex])} contentEditable="true" className={styles.cell}>{d[dataProps[hIndex]].fragment}</div>
                    : <p onInput={(e) => editFunction(e, data[dIndex].id, dataProps[hIndex])} contentEditable="true" className={styles.cell}>{d[dataProps[hIndex]]}</p>)}
                  {editable && dataProps.length === 0 && (typeof (d[dataProps[hIndex]]) === 'object'
                    ? <div onInput={(e) => editFunction(e, data[dIndex].id, dataProps[hIndex])} contentEditable="true" className={styles.cell}>{d[headers[hIndex]].fragment}</div>
                    : <p onInput={(e) => editFunction(e, data[dIndex].id, dataProps[hIndex])} contentEditable="true" lassName={styles.cell}>{d[headers[hIndex]]}</p>)}
                </div>
              ))}
            </div>
          ))}
          {details
            ? (
              <div key="Details">
                <header className={styles.cellContainer}>
                  <div className={styles.cell}>
                    <p>Details</p>
                  </div>
                </header>
                {slice.map((d, dIndex) => (
                  <div
                    key={d[dataKeyProp]}
                    className={styles.cellContainer}
                    style={dIndex % 2 === 0 ? {
                      backgroundColor: '#F6F6F6',
                    } : { backgroundColor: '#FFFFFF' }}
                  >
                    {React.isValidElement(d)
                      ? <div className={styles.cell}>{d}</div>
                      : (
                        <div className={styles.cell}>
                          <div>
                            <Info onClick={() => { selectCard(d); }} />
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )
            : null}
        </div>
        {numRows < data.length && (
        <TableFooter range={tableRange} slice={slice} setPage={setPage} page={page} className={styles.Footer} onClick={() => setPage(page)} />
        )}
      </div>
    )
  );
}

Table.propTypes = {
  editable: PropTypes.bool,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortIndices: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataProps: PropTypes.arrayOf(PropTypes.string),
  checkbox: PropTypes.bool,
  dataKeyProp: PropTypes.string.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
  setSelected: PropTypes.func,
  editFunction: PropTypes.func,
  selectCard: PropTypes.func,
  details: PropTypes.bool,
  modify: PropTypes.arrayOf(PropTypes.string),
  modifyFuncs: PropTypes.arrayOf(PropTypes.func),
};

Table.defaultProps = {
  editable: false,
  sortIndices: [],
  checkbox: true,
  dataProps: [],
  selected: [],
  setSelected: () => null,
  editFunction: () => null,
  selectCard: () => null,
  details: false,
  modify: [],
  modifyFuncs: [],
};
