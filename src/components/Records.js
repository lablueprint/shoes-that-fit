import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Records.module.css';

// Airtable stuff

function Records({ base }) {
  const [records, setRecords] = useState([]);
  const [toggle, setToggle] = useState(false);
  const getPosts = () => {
    base('Records').select({ view: 'Grid view' }).all()
      .then((e) => {
        setRecords(e);
      });
  };

  function formatDate(date) {
    const today = new Date();
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if ((today.getTime() - date.getTime()) / 86400000 < 1) { // less than 1 day has passed
      if (date.getHours() > 12) {
        return `${date.getHours() - 12}:${minutes} PM`;
      }
      return `${date.getHours()}:${minutes} AM`;
    }
    if (!toggle) {
      setToggle(true);
    }
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  let interval = 0;
  function getLabel(date) {
    if (interval >= 5) {
      return '';
    }
    const today = new Date();
    const yearDelta = today.getFullYear() - date.getFullYear();
    // const monthDelta = today.getMonth() - date.getMonth();
    const dayDelta = (today.getTime() - date.getTime()) / 86400000;
    let label = '';

    /* eslint-disable no-fallthrough */
    switch (interval) {
      case 0:
        label = 'TODAY';
        interval = 1;
      case 1:
        if (dayDelta > 1) {
          label = 'THIS WEEK';
          interval = 2;
        }
      case 2:
        if (dayDelta > 7) {
          label = 'LAST THIRTY DAYS';
          interval = 3;
        }
      case 3:
        if (dayDelta > 30) {
          label = 'THIS YEAR';
          interval = 4;
        }
      default:
        if (yearDelta > 0) {
          label = 'ALL PREVIOUS ACTIVITY';
          interval = 5;
        }
    }
    /* eslint-enable no-fallthrough */
    return label;
  }

  useEffect(getPosts, []);

  let maxIndex = 6;
  if (maxIndex >= records.length) {
    maxIndex = records.length - 1;
  }

  // const offset = new Date().getTimezoneOffset() / 60;
  const totalDisplay = records.map((record) => (
    <div className={styles.record} key={record.id}>
      <p className={styles.message}>{record.fields.Message}</p>
      <p className={styles.date}>{formatDate(new Date(record.fields.Created))}</p>
    </div>
  ));

  const intervalInfo = [];
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    const label = getLabel(new Date(record.fields.Created));
    if (label !== '') {
      intervalInfo[i] = label;
      // intervalInfo.push({ position: i, text: label });
    }
  }

  const display = [];
  for (let i = 0; i <= maxIndex; i += 1) {
    if (intervalInfo[i] !== undefined) {
      display.push(
        <div key={i} className={styles['interval-header']}>
          <h3>{intervalInfo[i]}</h3>
        </div>,
      );
    }
    display.push(totalDisplay[i]);
  }

  return (
    <div className={styles['main-container']}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Recent Activity</h1>
        </div>
        <Link to="/records" className={styles.info}>
          view all &gt;
        </Link>
      </div>
      <div className={styles.main}>
        {display}
      </div>
    </div>
  );
}

Records.propTypes = {
  base: PropTypes.func.isRequired,
};

export default Records;
