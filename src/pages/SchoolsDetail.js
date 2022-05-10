import React, { useState, useEffect } from 'react';
// import './OrderListAdmin.css';
import { ChevronLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './SchoolsDetail.module.css';

// import { AdminCard } from '../components';

function SchoolsDetail({ base }) {
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
    <div className={styles.orderFormContainer}>
      <script src="print.js" />
      <div className={styles.header}>
        <ChevronLeft size={30} type="button" />
        Directory
      </div>
      <div className={styles.format}>
        <div className={styles.column}>
          <div className={styles.sub}>
            School Information
          </div>
          <div className={styles.column}>
            <div className={styles.column}>
              <b>School Name </b>
            </div>
            <div className={styles.column}>
              {info.School}
            </div>
            <div className={styles.column}>
              <b>Address</b>
            </div>
            <div className={styles.column}>
              {info.Address1}
            </div>
            <div className={styles.column}>
              {info.City}
            </div>
            <div className={styles.column}>
              {info.State}
            </div>
            <div className={styles.column}>
              {info['Zip Code']}
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.sub}>
            Contact Information
          </div>
          <div className={styles.column}>
            <div className={styles.column}>
              <b> Name</b>
            </div>
            <div className={styles.column}>
              {info['First Name']}
              {' '}
              {info['Last Name']}
            </div>
            <div className={styles.column}>
              <b>Email Address </b>
            </div>
            <div className={styles.column}>
              {info['Email Address']}
            </div>
            <div className={styles.column}>
              <b>Phone Number </b>
            </div>
            <div className={styles.column}>
              {info.Phone}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default SchoolsDetail;

SchoolsDetail.propTypes = {
  base: PropTypes.func.isRequired,
};
