import React, { useState, useEffect } from 'react';
import { AdminCard } from '../components';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function OrderListAdmin() {
  const [cards, setCards] = useState([]);

  const getCards = () => {
    base('Orders')
      .select({ view: 'Grid view' })
      .all()
      .then((records) => {
        setCards(records);
      });
    console.log(cards);
  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    <>
      <h1>Active orders: </h1>
      {cards.filter((card) => (card.fields.Active === 'y')).map((card, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <p />
          <AdminCard
            school={card.fields.School}
            firstName={card.fields['First Name']}
            lastName={card.fields['Last Name']}
            email={card.fields.Email}
            phone={card.fields.Phone}
            shoeBrand={card.fields['Shoe Brand']}
            shoeSize={card.fields['Shoe Size']}
          />
        </div>
      ))}
      {/* <p>Admin View</p>
      {cards.map((card, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <p> Hello </p>
          <AdminCard
            client={card.fields['Client Name']}
            location={card.fields['Location Name']}
            bin={card.fields['Bin Name']}
            partName={card.fields['Part Name']}
            partDescription={card.fields['Part Description']}
            quantity={card.fields.Quantity}
          />
        </div>
      ))} */}
    </>
  );
}

export default OrderListAdmin;
