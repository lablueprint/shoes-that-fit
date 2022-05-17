/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// import Card from '../components/card';
import { Table } from '../components';

function AdminList({ isLoggedIn, base }) {
  const [cards, setCards] = useState([]);
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
  const headers = ['Active', 'Address', 'City', 'Contact Name', 'Email Address', 'Notes', 'Phone', 'School', 'State', 'Zip Code'];
  // card.Orders will go into details page, unsure how to implement this right now
  const dataProps = ['Active', 'Address1', 'City', 'Contact Name', 'Email Address', 'Notes', 'Phone', 'School', 'State', 'Zip Code'];
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

  // const getId = () => {
  //   unique = [...new Set(cards.map((card) => card.fields.Time))];
  // };

  return (
    !isLoggedIn
      ? (<Navigate to="/" />)
      : (
        cards && cards.length > 0 && <Table headers={headers} sortIndices={sortIndices} data={cards} dataProps={dataProps} dataKeyProp={dataKeyProp} />
      )
  );
}

export default AdminList;

AdminList.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  base: PropTypes.func.isRequired,
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
