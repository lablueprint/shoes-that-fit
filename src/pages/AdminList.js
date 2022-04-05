import React, { useState, useEffect } from 'react';
import Card from '../components/card';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(
  airtableConfig.baseKey,
);

function AdminList() {
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
  );
}

export default AdminList;

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
