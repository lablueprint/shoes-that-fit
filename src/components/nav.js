import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

export default function Nav() {
  return (
    <div>
      <ul>
        <ul><Link to="/home">Home</Link></ul>
        <ul><Link to="/inventory">Inventory</Link></ul>
        <ul><Link to="/newshoeform">New Shoe Form</Link></ul>
        <ul><Link to="/orderform">Order Form</Link></ul>
        <ul><Link to="/adminlist">Admin List</Link></ul>
        <ul><Link to="/admindashboard">Admin Dashboard</Link></ul>
      </ul>
      <hr />
    </div>
  );
}
