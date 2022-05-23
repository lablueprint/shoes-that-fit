/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// import Card from '../components/card';
import { ChevronLeft } from 'lucide-react';
import { Table, OrderListAdmin } from '../components';
import styles from './AdminList.module.css';

function AdminList({ isLoggedIn, base }) {
  const [cards, setCards] = useState([]);
  const [curID, setCurID] = useState('');
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
  const headers = ['Point of Contact', 'Date', 'School', 'Status', 'Details'];
  // card.Orders will go into details page, unsure how to implement this right now
  const dataProps = ['Contact Name', 'Date', 'School', 'Active', 'Details', 'ID'];
  const dataKeyProp = 'ID';
  const sortIndices = [0, 2, 3];

  const getCards = () => {
    base('Orders')
      .select({ view: 'Grid view' })
      .all()
      .then((records) => {
        setCards(records.map((r) => ({
          ...r.fields,
          Date: new Date(r.fields.Date).toLocaleString('en-US', {
            dateStyle: 'short',
          }),
          Active: r.fields.Active ? <div className={styles.statusChildInProgress}>In Progress</div>
            : <div className={styles.statusChildFulfilled}>Fulfilled</div>,
        })));
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  // const getId = () => {
  //   unique = [...new Set(cards.map((card) => card.fields.Time))];
  // };

  const clearSpecificCard = () => {
    setCurID('');
  };

  const setCurCard = (d) => {
    setCurID(d.ID);
  };

  return (
    !isLoggedIn
      ? (<Navigate to="/" />)
      : (
        <>
          {curID.length === 0 && cards && cards.length > 0
            && (
            <div className={styles.adminList}>
              <Table
                headers={headers}
                sortIndices={sortIndices}
                data={cards}
                dataProps={dataProps}
                dataKeyProp={dataKeyProp}
                details
                selectCard={setCurCard}
              />
            </div>
            )}
          {curID.length > 0 && (
            <>
              <div className={styles.back}>
                <ChevronLeft size={50} type="button" onClick={clearSpecificCard} />
              </div>
              <OrderListAdmin id={curID} base={base} />
            </>
          )}
        </>
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
