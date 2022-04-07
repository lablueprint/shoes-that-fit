import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardOrders.module.css';

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

function DashboardOrders() {
  const [displayedCards, setDisplayedCards] = useState([]);

  const getCards = () => {
    base('Orders')
      .select({ view: 'Grid view' })
      .all()
      .then((records) => {
        const activeOrders = records.filter((card) => card.fields.Active === 'y');
        if (activeOrders.length < 3) {
          setDisplayedCards(activeOrders.reverse());
        } else {
          // eslint-disable-next-line max-len
          const latestActiveOrders = activeOrders.slice(activeOrders.length - 3, activeOrders.length);
          setDisplayedCards(latestActiveOrders.reverse());
        }
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    <div className={styles.dashboardComponent}>
      <div className={styles.orderDashboardHeader}>
        <h2 className={styles.adminDashboardH2}>Orders</h2>
        <Link to="/adminlist" className={styles.LinkStyles}>View All &gt;</Link>
      </div>
      <table className={styles.orderDashboardTable}>
        <thead className={styles.orderTableTHead}>
          <tr>
            <th className={styles.orderTableData}>Date</th>
            <th className={styles.orderTableData}>Name</th>
            <th className={styles.orderTableData}>School</th>
            <th className={styles.orderTableData}>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedCards.map((card) => (
            <tr>
              <td className={styles.orderTableData}>{`${card.fields.Time.slice(5, 7)}/${card.fields.Time.slice(8, 10)}/${card.fields.Time.slice(2, 4)}`}</td>
              <td className={styles.orderTableData}>{card.fields.Name}</td>
              <td className={styles.orderTableData}>{card.fields['Teacher/School']}</td>
              <td className={styles.incompleteBox}>Incomplete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardOrders;
