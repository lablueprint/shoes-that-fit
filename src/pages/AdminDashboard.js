import React from 'react';
import DashboardOrders from '../components/DashboardOrders';
import InventorySummary from '../components/InventorySummary';

function AdminDashboard() {
  return (
    <>
      <h1>Welcome Back, Admin</h1>
      <DashboardOrders />
      <InventorySummary />
    </>
  );
}

export default AdminDashboard;
