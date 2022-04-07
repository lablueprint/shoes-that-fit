import React from 'react';
import DashboardOrders from '../components/DashboardOrders';
import InventorySummary from '../components/InventorySummary';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  return (
    <>
      <h1 className={styles.welcome}>Welcome Back, Admin</h1>
      <div className={styles.topComponents}>
        <DashboardOrders />
        <InventorySummary />
      </div>
    </>
  );
}

export default AdminDashboard;
