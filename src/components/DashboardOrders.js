import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './DashboardOrders.module.css';
import { Table } from '.';

function DashboardOrders({ base }) {
  const [displayedCards, setDisplayedCards] = useState([]);

  useEffect(() => {
    const getCards = async () => {
      await base('Orders')
        .select({ view: 'Grid view' })
        .all()
        .then((records) => {
          const activeOrders = records.filter((card) => card.fields.Active === true);
          if (activeOrders.length < 3) {
            setDisplayedCards(activeOrders.reverse().map((r) => (r.fields)));
          } else {
            // eslint-disable-next-line max-len
            const latestActiveOrders = activeOrders.slice(activeOrders.length - 3, activeOrders.length);
            setDisplayedCards(latestActiveOrders.reverse().map((r) => (r.fields)));
          }
        });
    };
    getCards();
  }, []);

  const headers = ['Date', 'Name', 'School/District', 'Status'];
  const dataKeyProp = 'ID';
  const dataProps = ['Date', 'Contact Name', 'School', 'Active'];
  const modify = ['Date', 'Active'];
  const formatDate = (date) => new Date(Date.parse(date)).toLocaleDateString('en', { month: 'numeric', day: 'numeric', year: '2-digit' });
  const formatStatus = (status) => (
    <span className={styles.incompleteBox}>
      {' '}
      {status}
      {' '}
      INCOMPLETE
    </span>
  );
  const modifyFuncs = [formatDate, formatStatus];

  return (
    <div className={styles.dashboardComponent}>
      <div className={styles.orderDashboardHeader}>
        <h2 className={styles.adminDashboardH2}>Orders</h2>
        <Link to="/adminlist" className={styles.LinkStyles}>view all &gt;</Link>
      </div>
      <div className={styles.orderDashboardTable}>
        <Table
          className={styles.orders}
          headers={headers}
          checkbox={false}
          data={displayedCards}
          dataProps={dataProps}
          dataKeyProp={dataKeyProp}
          modify={modify}
          modifyFuncs={modifyFuncs}
        />
      </div>
    </div>
  );
}

export default DashboardOrders;

DashboardOrders.propTypes = {
  base: PropTypes.func.isRequired,
};
