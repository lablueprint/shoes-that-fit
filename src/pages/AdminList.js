/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
// import Card from '../components/card';
import { ChevronLeft } from 'lucide-react';
import { Table } from '../components';
import OrderListAdmin from './OrderListAdmin';

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
  const [specificCardID, setSpecificCardID] = useState('');
  // let unique = [];
  // Card ex:
  /* Active: true
  Address1: "330 De Neve"
  City: "Los Angeles"
  Contact Name: "laura"
  Date: "January 1 2022\n"
  Email Address: "lauralu201@g.ucla.edu"
  ID: "reck2fPposfrHuiRY"
  Notes: "Please give Jiamin friends"
  Orders: "[{\"name\":\"hello\",\"gender\":\"f\",\"wideWidth\":true,\"size\":\"1\",\"age\":\"1\",\"school\":\"i hate jiamin\"},{\"name\":\"bye\",\"gender\":\"f\",\"wideWidth\":true,\"size\":\"1\",\"age\":\"1\",\"school\":\"i hate jiamin EVEN MORE\"}]"
  Phone: "313-545-4949"
  School: "UCLA"
  State: "California"
  UserID: "1"
  Zip Code: "90024" */
  const headers = ['Active', 'Address', 'City', 'Contact Name', 'Email Address', 'Notes', 'Phone', 'School', 'State', 'Zip Code', 'Details'];
  // card.Orders will go into details page, unsure how to implement this right now
  const dataProps = ['Active', 'Address1', 'City', 'Contact Name', 'Email Address', 'Notes', 'Phone', 'School', 'State', 'Zip Code', 'Details'];
  const dataKeyProp = 'ID';
  const sortIndices = [0, 3, 4];

  const getCards = () => {
    base('Orders')
      .select({ view: 'Grid view' })
      .all()
      .then((records) => {
        setCards(records.map((r) => (r.fields)));
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  const selectCard = (cardID) => {
    setSpecificCardID(cardID);
    return true;
  };

  const clearSpecificCard = () => {
    setSpecificCardID('');
  };

  useEffect(() => {
    clearSpecificCard();
  }, []);

  const style = {
    cursor: 'pointer',
  };

  return (
    (specificCardID === '')
      ? cards && cards.length > 0 && <Table headers={headers} sortIndices={sortIndices} data={cards} dataProps={dataProps} dataKeyProp={dataKeyProp} selectCard={selectCard} />
      : (
        <div>
          <ChevronLeft style={style} size={50} type="button" onClick={clearSpecificCard} />
          <OrderListAdmin id={specificCardID} />
        </div>
      )
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
