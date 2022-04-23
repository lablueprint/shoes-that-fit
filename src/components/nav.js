import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';
import PropTypes from 'prop-types';

export default function Nav({ loggedIn }) {
  return (
    !loggedIn ? (null)
      : (
        <div>
          <ul>
            <ul><Link to="/home">Home</Link></ul>
            <ul><Link to="/inventory">Inventory</Link></ul>
            <ul><Link to="/newshoeform">New Shoe Form</Link></ul>
            <ul><Link to="/orderform">Order From</Link></ul>
          </ul>
          <hr />
        </div>
      )
  );
}

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};
