import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import styles from './table.module.css';
import detailsIcon from '../assets/DetailsIcon.svg';

const sorts = {
  descending: 0,
  ascending: 1,
};

export default function Table({
  headers, sortIndices, data, dataProps, checkbox,
  dataKeyProp, selectCard, details, modify, modifyFuncs,
}) {
  const [lastIndex, setLast] = useState(0);
  const [sortDir, setDir] = useState(sorts.descending);
  const [ready, setReady] = useState(false);

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

        return 0;
      });
    } else {
      data.sort((a, b) => a[headers[index]].localeCompare(b[headers[index]]));
    }

    if (dir) {
      data.reverse();
    }

    setReady(true);
  }

  useEffect(() => {
    sortData(0, sorts.descending);
  }, []);

  return (
    ready && (
    <div className={styles.container}>
      {checkbox && (
      <div className={styles.checkboxColumn}>
        <header className={styles.cellContainer}>
          <div className={styles.cell}>
            <input type="checkbox" className={styles.checkbox} />
          </div>
        </header>
        {data.map((d, dIndex) => (
          <div
            key={d[dataKeyProp]}
            className={styles.cellContainer}
            style={dIndex % 2 === 0 ? {
              backgroundColor: '#F6F6F6',
            } : { backgroundColor: '#FFFFFF' }}
          >
            <div className={styles.cell}>
              <input type="checkbox" className={styles.checkbox} />
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
          {data.map((d, dIndex) => (
            <div
              key={d[dataKeyProp]}
              className={styles.cellContainer}
              style={dIndex % 2 === 0 ? {
                backgroundColor: '#F6F6F6',
              } : { backgroundColor: '#FFFFFF' }}
            >
              {(dataProps.length === 0 && React.isValidElement(d[headers[hIndex]]))
              || (dataProps.length !== 0 && React.isValidElement(d[dataProps[hIndex]]))
                ? (
                  <div className={styles.cell}>
                    {dataProps.length === 0 && d[headers[hIndex]]}
                    {dataProps.length !== 0 && d[dataProps[hIndex]]}
                  </div>
                )
                : (
                  <div className={styles.cell}>
                    {dataProps.length === 0 && (d[headers[hIndex]]
                      && <p>{d[headers[hIndex]].toString()}</p>)}
                    {details ? (
                      <div>
                        {(dataProps.length !== 0 && dataProps[hIndex] !== 'Details'
                          ? (d[dataProps[hIndex]] !== '' && (modify.includes(dataProps[hIndex])
                          && modifyFuncs.length > modify.indexOf(dataProps[hIndex])
                          // eslint-disable-next-line max-len
                          && (modifyFuncs[modify.indexOf(dataProps[hIndex])](d[dataProps[hIndex]])))
                          )
                          || ((d[dataProps[hIndex]] && d[dataProps[hIndex]] !== '' && !modify.includes(dataProps[hIndex])
                           && <p>{d[dataProps[hIndex]].toString()}</p>))
                          : (
                            <button type="button" style={{ color: 'black' }} onClick={() => { selectCard(d); }}>
                              <img src={detailsIcon} alt="details" />
                            </button>
                          ))}
                      </div>
                    ) : dataProps.length !== 0
                    && d[dataProps[hIndex]] && d[dataProps[hIndex]] !== ''
                    && (((modify.includes(dataProps[hIndex])
                    && modifyFuncs.length > modify.indexOf(dataProps[hIndex])
                    // eslint-disable-next-line max-len
                    && (modifyFuncs[modify.indexOf(dataProps[hIndex])](d[dataProps[hIndex]])))
                    )
                    || (!modify.includes(dataProps[hIndex])
                     && (
                     <p>
                       {d[dataProps[hIndex]].toString()}
                     </p>
                     )))}
                  </div>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
    )
  );
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortIndices: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataProps: PropTypes.arrayOf(PropTypes.string),
  checkbox: PropTypes.bool,
  dataKeyProp: PropTypes.string.isRequired,
  selectCard: PropTypes.func,
  details: PropTypes.bool,
  modify: PropTypes.arrayOf(PropTypes.string),
  modifyFuncs: PropTypes.arrayOf(PropTypes.func),

};

Table.defaultProps = {
  sortIndices: [],
  checkbox: true,
  dataProps: [],
  selectCard: () => null,
  details: false,
  modify: [],
  modifyFuncs: [],
};
