import React from 'react';
import PropTypes from 'prop-types';

function Card({
  school, firstName, lastName, email, phone, shoes,
}) {
  return (
    <>
      School:
      {' '}
      {school}
      <br />
      First Name:
      {' '}
      {firstName}
      <br />
      Last Name:
      {' '}
      {lastName}
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
      {shoes.map((order) => (
        <p>
          {order.shoeBrand}
          <br />
          {order.shoeSize.map((size, i) => (
            <>
              size
              {' '}
              {size}
              :
              {order.quantity[i]}
              {' '}
              shoes
              <br />
            </>
          ))}
        </p>
      ))}
      <br />
    </>
  );
}

Card.propTypes = {
  school: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  shoes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Card;
