import React from 'react';
import { Link } from 'react-router-dom';
import styles from './nav.module.css';

export default function Nav() {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.navEntry}><Link to="/home" className={styles.linkStyles}>Home</Link></ul>
      <ul className={styles.navEntry}><Link to="/inventory" className={styles.linkStyles}>Inventory</Link></ul>
      <ul className={styles.navEntry}><Link to="/newshoeform" className={styles.linkStyles}>New Shoe Form</Link></ul>
      <ul className={styles.navEntry}><Link to="/orderform" className={styles.linkStyles}>Order Form</Link></ul>
      <ul className={styles.navEntry}><Link to="/adminlist" className={styles.linkStyles}>Admin List</Link></ul>
      <ul className={styles.navEntry}><Link to="/admindashboard" className={styles.linkStyles}>Admin Dashboard</Link></ul>
    </div>
  );
}
