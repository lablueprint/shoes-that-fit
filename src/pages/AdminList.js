import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import Card from '../components/card';

function AdminList({ isLoggedIn, base }) {
  const [cards, setCards] = useState([]);
  let unique = [];

  const getCards = () => {
    base('Orders')
      .select({ view: 'Grid view' })
      .all()
      .then((records) => {
        setCards(records);
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  const getId = () => {
    unique = [...new Set(cards.map((card) => card.fields.Time))];
  };

  return (
    !isLoggedIn
      ? (<Navigate to="/" />)
      : (
        <>
          {getId()}
          <h1>ADMINLIST: </h1>
          {
        unique.map((value) => (
          <div>
            <h2>
              <text>
                ID:
                {'\n\n\n\n'}
                {new Date(Date.parse(value)).toLocaleString('en-US')}
              </text>
              <text>
                {'\n\n\n\n'}
                Quantity:
                {cards.filter((card) => card.fields.Time === `${value}`).length}
              </text>
            </h2>

            <div>
              {cards.filter((card) => card.fields.Time === `${value}`).map((card, index) => (
              // eslint-disable-next-line react/no-array-index-key
                <div key={index}>
                  <p />
                  <Card
                    name={card.fields.Name}
                    gender={card.fields.Gender}
                    wideWidth={card.fields.Wide}
                    size={card.fields.Size}
                    age={card.fields.Age}
                    school={card.fields['Teacher/School']}
                    shoeSize={card.fields.Active}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      }
        </>
      )
  );
}

export default AdminList;

AdminList.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  base: PropTypes.objectOf(PropTypes.object).isRequired,
};

// cards.filter((card) => card.fields.Time === `${value}`).map((card, index) => (
//   // eslint-disable-next-line react/no-array-index-key
//   <div key={index}>
//     <p />
//     <Card
//       name={card.fields.Name}
//       gender={card.fields.Gender}
//       wideWidth={card.fields.Wide}
//       size={card.fields.Size}
//       age={card.fields.Age}
//       school={card.fields['Teacher/School']}
//       shoeSize={card.fields.Active}
//     />
//   </div>
// ))
