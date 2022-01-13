import React from 'react';
import PropTypes from 'prop-types';

export default function Card({
  school, first_name, last_name, email, phone, shoes,
}) {
  return (
    <>
      School:
      {' '}
      {school}
      <br />
      First Name:
      {' '}
      {first_name}
      <br />
      Last Name:
      {' '}
      {last_name}
      <br />
      Email:
      {' '}
      {email}
      <br />
      Phone:
      {' '}
      {phone}
      <br />
      Shoes:
      {' '}
      {shoes}
      <br />
    </>
  );
}

Card.propTypes = {
  school: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  shoes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
