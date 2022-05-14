import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Smile } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './InventorySummaryDashboard.module.css';

function InventorySummary({ base }) {
  // eslint-disable-next-line no-unused-vars
  const [rows, setRows] = useState([]);
  const [quantityFulfilled, setQuantityFulfilled] = useState(0);

  const getQuantityFulfilled = () => {
    let quantity = 0;
    for (let i = 0; i < rows.length; i += 1) {
      quantity += (rows[i].fields.Size || 0);
      // console.log(rows[i].fields.Size);
    }
    setQuantityFulfilled(quantity);
  };

  useEffect(() => {
    const getOrders = async () => {
      await base('Orders').select({
        view: 'Grid view',
        filterByFormula: `SEARCH("${'y'}",{Active})`,
      }).all()
        .then((records) => {
          setRows(records);
        });
    };
    getOrders();
  }, []);

  useEffect(getQuantityFulfilled, [rows]);

  // console.log(rows.length);
  // {styles.dashboardComponent} instead of styles.inventory
  return (
    <div className={styles.dashboardComponent}>
      <div className={styles.inventoryDashboardHeader}>
        <h2 className={styles.inventory}>Inventory</h2>
        <div className={styles.LinkStyles}>
          <Link to="/inventory">go to inventory &gt;</Link>
        </div>
      </div>

      <div className={styles.inventoryDashboardBody}>
        <div className={styles.inventoryDashboardQuantity}>
          <Box color="#6BB7E8" className={styles.inventoryBox} />
          <h3 className={styles.minorTitle}>Total Quantity</h3>
          <p className={styles.minorTitleData}>{rows.length}</p>
        </div>
        <div className={styles.inventoryDashboardShipped}>
          <Smile color="#D66330" className={styles.inventorySmile} />
          <h3 className={styles.minorTitle}>Kids Helped</h3>
          <p className={styles.minorTitleData}>{quantityFulfilled}</p>
        </div>
      </div>
    </div>
  );
}

export default InventorySummary;

InventorySummary.propTypes = {
  base: PropTypes.func.isRequired,
};
