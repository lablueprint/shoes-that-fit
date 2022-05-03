import React, { useState, useEffect } from 'react';
// import './OrderListAdmin.css';
import styles from './SchoolsDetail.module.css';
// import { AdminCard } from '../components';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function SchoolsDetail() {
  const [info, setInfo] = useState([]);
  const id = 'recyXJY3yFJKQHYD2';
  const getCards = () => {
    base('Schools')
      .select({ filterByFormula: `ID="${id}"` })
      .all()
      .then((records) => {
        console.log(records[0].fields);
        setInfo(records[0].fields);
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    info !== []
      ? (
        <div className={styles.container}>
          <div className={styles.head}>Directory: </div>
          <div className={styles.hello}>
            <div className={styles.row}>
              <div className={styles.title}>
                School Name
              </div>
              <p>
                {info.School}
              </p>
              <div className={styles.title}>
                Address
              </div>
              <p>
                {info.Address1}
                <br />
                {info.City}
                {' '}
                {info.State}
                <br />
                {info['Zip Code']}
              </p>
            </div>
            <div className={styles.row}>
              <div className={styles.title}>
                Name
              </div>
              <p>
                {info['First Name']}
                {' '}
                {info['Last Name']}
              </p>
              <div className={styles.title}>
                Email Address
              </div>
              <p>
                {info['Email Address']}
              </p>

              <div className={styles.title}>
                Phone Number
              </div>
              <p>
                {info.Phone}
              </p>
            </div>
          </div>

        </div>
      )
      : null
  );
}

export default SchoolsDetail;
