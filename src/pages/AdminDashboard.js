import React from 'react';
import DashboardOrders from '../components/DashboardOrders';
import InventorySummary from '../components/InventorySummary';
import Records from '../components/Records';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <h4>Welcome Back, Admin</h4>
      </div>
      <div className={styles.topComponents}>
        <DashboardOrders />
        <InventorySummary />
      </div>
      <div className={styles.recordContainer}>
        <Records />
      </div>
    </div>
  );
}

export default AdminDashboard;
