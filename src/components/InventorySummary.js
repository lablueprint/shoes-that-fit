import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Smile } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './InventorySummaryDashboard.module.css';

function InventorySummary({ base }) {
  // eslint-disable-next-line no-unused-vars
  const [rows, setRows] = useState([]);
  const [quantityFulfilled, setQuantityFulfilled] = useState(0);
  const [kidsHelped, setKidsHelped] = useState(0);

  const getQuantityFulfilled = () => {
    let quantity = 0;
    for (let i = 0; i < rows.length; i += 1) {
      quantity += (rows[i].fields.Quantity || 0);
      // console.log(rows[i].fields.Size);
    }
    setQuantityFulfilled(quantity);
  };

  useEffect(() => {
    const getOrders = async () => {
      await base('TestInventory').select({
        view: 'Grid view',
      }).all()
        .then((records) => {
          setRows(records);
        });
    };
    getOrders();
  }, []);

  useEffect(() => {
    const getNumberKids = async () => {
      await base('KidsHelped').select({
        view: 'Grid view',
      }).all()
        .then((records) => {
          setKidsHelped(records[0].fields['Kids Helped']);
        });
    };
    getNumberKids();
  }, []);

  useEffect(getQuantityFulfilled, [rows]);

  // console.log(rows.length);
  // {styles.dashboardComponent} instead of styles.inventory
  return (
    <div className={styles.dashboardComponent}>
      <div className={styles.inventoryDashboardHeader}>
        <h2 className={styles.inventory}>Inventory</h2>
        <Link to="/inventory" className={styles.LinkStyles}>go to inventory &gt;</Link>
      </div>

      <div className={styles.inventoryDashboardBody}>
        <div className={styles.inventoryDashboardQuantity}>
          <Box className={styles.inventoryBox} />
          <div className={styles.minorTitle}>Total Quantity</div>
          <div className={styles.minorTitleData}>{quantityFulfilled}</div>
        </div>
        <div className={styles.inventoryDashboardShipped}>
          <Smile className={styles.inventorySmile} />
          <div className={styles.minorTitle}>Kids Helped</div>
          <div className={styles.minorTitleData}>{kidsHelped}</div>
        </div>
      </div>
    </div>
  );
}

export default InventorySummary;

InventorySummary.propTypes = {
  base: PropTypes.func.isRequired,
};
