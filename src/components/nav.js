import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home, ClipboardList, ListOrdered, Gift, GraduationCap,
} from 'lucide-react';
import styles from './nav.module.css';

export default function Nav() {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.navEntry}>
        <Home color="#FFFFFF" />
        <Link to="/home" className={styles.linkStyles}>Home</Link>
      </ul>
      <ul className={styles.navEntry}>
        <ClipboardList color="#FFFFFF" />
        <Link to="/inventory" className={styles.linkStyles}>Inventory</Link>

      </ul>
      <ul className={styles.navEntry}>
        <ListOrdered color="#FFFFFF" />
        <Link to="/newshoeform" className={styles.linkStyles}>New Shoe Form</Link>
      </ul>
      <ul className={styles.navEntry}>
        <Gift color="#FFFFFF" />
        <Link to="/orderform" className={styles.linkStyles}>Order Form</Link>
      </ul>
      <ul className={styles.navEntry}>
        <GraduationCap color="#FFFFFF" />
        <Link to="/adminlist" className={styles.linkStyles}>Admin List</Link>
      </ul>
      <ul className={styles.navEntry}>
        <Home color="#FFFFFF" />
        <Link to="/admindashboard" className={styles.linkStyles}>Admin Dashboard</Link>
      </ul>
    </div>
  );
}
