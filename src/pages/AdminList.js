/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// import Card from '../components/card';
// import { ChevronLeft } from 'lucide-react';
import { Table, Details } from '../components';
import styles from './AdminList.module.css';

function AdminList({
  isLoggedIn, base, profile, username,
}) {
  const [cards, setCards] = useState([]);
  const [curID, setCurID] = useState('');
  const headers = ['Point of Contact', 'Date', 'School', 'Status'];
  // card.Orders will go into details page, unsure how to implement this right now
  const dataProps = ['Contact Name', 'Date', 'School', 'Active', 'ID'];
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
    getCards();
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
              <div className={styles.top}>
                <div className={styles.title}>Orders</div>
                <div className={styles.name}>{profile.contactName}</div>
              </div>
              <div className={styles.ordersTable}>
                <Table
                  className={styles.ordersTable}
                  headers={headers}
                  sortIndices={sortIndices}
                  data={cards}
                  dataProps={dataProps}
                  dataKeyProp={dataKeyProp}
                  details
                  selectCard={setCurCard}
                />
              </div>
            </div>
            )}
          {curID.length > 0 && (
          <Details id={curID} base={base} clearSpecificCard={clearSpecificCard} username={username} />
          )}
        </>
      )
  );
}

export default AdminList;

AdminList.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  base: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    role: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    phone: PropTypes.string,
    contactName: PropTypes.string,
    schoolName: PropTypes.string,
    zipCode: PropTypes.string,
  }).isRequired,
  username: PropTypes.string.isRequired,
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
