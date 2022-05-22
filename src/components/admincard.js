import React, { useState } from 'react';
import PropTypes from 'prop-types';

function AdminCard({
  school,
  firstName,
  lastName,
  email,
  phone,
  shoeBrand,
  shoeSize,
  base,
}) {
  const cardStyle = {
    'border-style': 'solid',
    'text-align': 'left',
    'padding-left': '30%',
    'padding-right': '30%',
    cursor: 'pointer',
  };

  const bigcardStyle = {
    'border-style': 'solid',
    'text-align': 'left',
    'padding-top': '5%',
    'padding-bottom': '5%',
    'padding-left': '30%',
    'padding-right': '30%',
    cursor: 'pointer',
  };

  const [clicked, setClicked] = useState(false);
  const [quantity, setQuantity] = useState(0);

  function cardClick() {
    setClicked(!clicked);
  }

  function fulfillOrder() {
    base('Test')
      .select({
        filterByFormula: `{Part Name} = ${shoeSize}`,
      })
      .firstPage((err, records) => {
        if (err) {
          console.error(err);
          console.log(typeof err);
          console.log('hello');
        }
        // console.log('Retrieved');
        // console.log(records[0].id);
        base('Test').update([
          {
            id: records[0].id,
            fields: {
              Quantity: 0,
            },
          },
        ], (err2, records2) => {
          if (err2) {
            console.error(err2);
            return;
          }
          records2.forEach((record) => {
            console.log(record.get('Client Name'));
          });
        });
      });
  }
  function getQuantity() {
    console.log(shoeSize);
    let answer = 0;
    base('Test')
      .select({
        filterByFormula: `{Part Name} = ${shoeSize}`,
      })
      .firstPage((err, records) => {
        if (err) {
          console.error(err);
          console.log(typeof err);
          console.log('Test');
        }
        // console.log('Retrieved');
        // console.log(records[0].id);
        base('Test').find(records[0].id, (err2, record2) => {
          if (err2) {
            console.error(err2);
          }
          // console.log('Retrieving Records', record2);
          console.log('Retrieving Records', record2.fields.Quantity);
          answer = record2.fields.Quantity;
          console.log(answer);

          setQuantity(answer);
        });
      });
  }
  const handleRequestClick = (e) => {
    // this will stop the bubbling effect of the parent and child click events
    e.stopPropagation();
    fulfillOrder();
    getQuantity();
  };
  getQuantity();
  const curCard = clicked ? (
    <div
      style={bigcardStyle}
      onClick={cardClick}
      onKeyDown={cardClick}
      role="button"
      tabIndex={0}
    >
      <div>
        School:
        {' '}
        {school}
      </div>
      <div>
        First Name:
        {firstName}
      </div>
      <div>
        Last Name:
        {lastName}
      </div>
      <div>
        Email:
        {email}
      </div>
      <div>
        Phone:
        {phone}
      </div>
      <div>
        Shoe Brand:
        {shoeBrand}
      </div>
      <div>
        Shoe Size:
        {shoeSize}
      </div>
      <div>
        Quantity:
        {quantity}
      </div>
      <button type="button" onClick={(event) => handleRequestClick(event)}>Fulfill!</button>
    </div>
  ) : (
    <div
      style={cardStyle}
      onClick={cardClick}
      onKeyDown={cardClick}
      role="button"
      tabIndex={0}
    >
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
    </div>
  );

  return <div>{curCard}</div>;
}

AdminCard.propTypes = {
  school: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  shoeBrand: PropTypes.string.isRequired,
  shoeSize: PropTypes.number.isRequired,
  base: PropTypes.func.isRequired,
};

export default AdminCard;
