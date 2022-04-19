import React, { useState, useEffect } from 'react';
import './OrderListAdmin.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(
  airtableConfig.baseKey,
);

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
      <div className="head">Active orders: </div>
      {cards
        .filter((card) => card.fields.ID === '2')
        .map((card, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            {/* <div className="hello">
            {card.fields.Time}
          </div> */}
            {card.fields.Time}
            <p />
            <div className="container">
              <table>
                <thead>
                  <tr>
                    <th width="263px">
                      Student&apos;s First Name and Last Name
                    </th>
                    <th width="100px">Age</th>
                    <th width="60px">Gender</th>
                    <th width="100px">Shoe Size</th>
                    <th width="70px">Wide Width?</th>
                    <th width="263px">Teacher or school?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={JSON.stringify(index)}>
                    <td>{card.fields.Name}</td>
                    <td>{card.fields.Age}</td>
                    <td>{card.fields.Gender}</td>
                    <td>{card.fields.Size}</td>
                    <td>{card.fields.Wide}</td>
                    <td>{card.fields['Teacher/School']}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </>
  );
}

export default OrderListAdmin;
