import React from 'react';
import PropTypes from 'prop-types';

function Card({
  school, firstName, lastName, email, phone, shoeBrand, shoeSize, quantity,
}) {
  const cardStyle = {
    'text-align': 'left',
    'padding-left': '30%',
    'padding-right': '30%',
  };
  return (
    <div style={cardStyle}>
      <div>
        School:
        {' '}
        {school}
      </div>
      <div>
        First Name:
        {' '}
        {firstName}
      </div>
      <div>
        Last Name:
        {' '}
        {lastName}
      </div>
      <div>
        Email:
        {' '}
        {email}
      </div>
      <div>
        Phone:
        {' '}
        {phone}
      </div>
      <div>
        Shoe Brand:
        {' '}
        {shoeBrand}
      </div>
      <div>
        Shoe Size:
        {' '}
        {shoeSize}
      </div>
      <div>
        Quantity:
        {' '}
        {quantity}
      </div>
    </div>
  );
}

Card.propTypes = {
  school: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  shoeBrand: PropTypes.string.isRequired,
  shoeSize: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
};

export default Card;
