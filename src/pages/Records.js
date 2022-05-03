import React, { useState, useEffect } from 'react';
import './Records.css';

// Airtable stuff
const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(airtableConfig.baseKey);

function Records() {
  const [records, setRecords] = useState([]);
  const [index, setIndex] = useState(0);
  const [toggle, setToggle] = useState(false);

  function incrementIndex(evt) {
    evt.preventDefault();
    if (index + 10 < records.length) {
      setIndex(index + 10);
    }
  }

  function decrementIndex(evt) {
    evt.preventDefault();
    if (index - 10 >= 0) {
      setIndex(index - 10);
    }
  }

  function formatDate(date) {
    const today = new Date();
    if ((today.getTime() - date.getTime()) / 86400000 < 1) { // less than 1 day has passed
      if (date.getHours() > 12) {
        return `${date.getHours() - 12}:${date.getMinutes()} PM`;
      }
      return `${date.getHours()}:${date.getMinutes()} AM`;
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
    const monthDelta = today.getMonth() - date.getMonth();
    const dayDelta = (today.getTime() - date.getTime()) / 86400000;

    let label = '';

    /* eslint-disable no-fallthrough */
    switch (interval) {
      case 0:
        label = 'Today';
        interval = 1;
      case 1:
        if (dayDelta > 1) {
          label = 'This Week';
          interval = 2;
        }
      case 2:
        if (dayDelta > 7) {
          label = 'This Month';
          interval = 3;
        }
      case 3:
        if (monthDelta > 0) {
          label = 'This Year';
          interval = 4;
        }
      default:
        if (yearDelta > 0) {
          label = 'All Previous Activity';
          interval = 5;
        }
    }
    /* eslint-enable no-fallthrough */
    return label;
  }

  useEffect(() => {
    const getPosts = async () => {
      await base('Records').select({ view: 'Grid view' }).all()
        .then((e) => {
          setRecords(e);
        });
    };
    getPosts();
  }, []);

  let maxIndex = index + 9;
  if (maxIndex >= records.length) {
    maxIndex = records.length - 1;
  }

  // const offset = new Date().getTimezoneOffset() / 60;
  const totalDisplay = records.map((record) => (
    <div className="record" key={record.id}>
      <p className="message">{record.fields.Message}</p>
      <p className="date">{formatDate(new Date(record.fields.Created))}</p>
    </div>
  ));

  const intervalInfo = [];
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    const label = getLabel(new Date(record.fields.Created));
    if (label !== '') {
      intervalInfo.push({ position: i, text: label });
    }
  }

  const display = [];
  let intervalIndex = 0;
  for (let i = index; i <= maxIndex; i += 1) {
    if (intervalIndex < intervalInfo.length && i === intervalInfo[intervalIndex].position) {
      display.push(
        <div key={i} className="interval-header">
          <h3>{intervalInfo[intervalIndex].text}</h3>
        </div>,
      );
      intervalIndex += 1;
    }
    display.push(totalDisplay[i]);
  }

  return (
    <div>
      <h1>Recent Activity</h1>
      <div className="info">
        <form onSubmit={incrementIndex}>
          <input
            disabled={maxIndex === records.length - 1}
            value=">"
            type="submit"
          />
        </form>
        <form onSubmit={decrementIndex}>
          <input
            disabled={index === 0}
            value="<"
            type="submit"
          />
        </form>
      </div>
      <div className="main">
        {display}
      </div>
    </div>
  );
}

export default Records;
