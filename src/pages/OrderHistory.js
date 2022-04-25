// import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import Card from '../components/card';
import styles from './OrderForm.module.css';
import OrderListAdmin from './OrderListAdmin';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function OrderHistory() {
  const [cards, setCards] = useState([]);
  const [specificCardID, setSpecificCardID] = useState('');
  // const [specificCard, setSpecificCard] = useState(null);
  // const [display, setDisplay] = useState([]);
  const getCards = () => {
    base('Orders').select({ view: 'Grid 2' }).all()
      .then((records) => {
        setCards(records);
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  const deleteCard = (cardId) => {
    base('Orders').destroy([cardId], (err, deletedRecords) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Deleted', deletedRecords.length, 'records');
      getCards();
    });
  };

  const selectCard = (cardID) => {
    console.log('in select card');
    setSpecificCardID(cardID);
    // base('Orders').find(cardID, (err, record) => {
    //   if (err) { console.error(err); return; }
    //   console.log('Retrieved', record.id);
    //   console.log(record);
    //   setSpecificCard(record);
    // });
    // OrderListAdmin(cardID);
  };

  const clearSpecificCard = () => {
    setSpecificCardID('');
    // setSpecificCard(null);
  };

  // const generateTable = () => {
  //   console.log('generate table');
  //   if (specificCardID !== '') {
  //     console.log('generate table');
  //     setDisplay(OrderListAdmin(specificCardID));
  //   }
  // };

  // useEffect(() => {
  //   generateTable(specificCardID);
  // }, []);

  return (
    specificCardID === ''
      ? (
        <div className={styles.orderHistory}>
          <div className={styles.orderText}>Orders in Progress</div>

          {cards.filter((card) => (card.fields.ID === '1' && card.fields.Active === true)).length === 0
            ? <div className={styles.no}>No orders in progress.</div>
            : cards.filter((card) => (card.fields.ID === '1' && card.fields.Active === true)).map((card) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={card.id} className={styles.cardBox}>
                <Card
                  schoolDistrict={card.fields.School}
                  time={card.fields.Date}
                  fulfilled={(card.fields.Active === true)}
                  cardId={card.id}
                  deleteCard={deleteCard}
                  selectCard={selectCard}
                />
              </div>
            ))}
          <div className={styles.orderText}>Previous Orders</div>
          {cards.filter((card) => (card.fields.ID === '1' && !(card.fields.Active === true))).length === 0
            ? <div className={styles.no}>No previous orders.</div>
            : cards.filter((card) => (card.fields.ID === '1' && !(card.fields.Active === true))).map((card) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={card.id} className={styles.cardBox}>
                <Card
                  schoolDistrict={card.fields.School}
                  time={card.fields.Date}
                  fulfilled={(card.fields.Active === true)}
                  cardId={card.id}
                  deleteCard={deleteCard}
                  selectCard={selectCard}
                />
              </div>
            ))}
        </div>
      )
      : (
        <>
          {console.log('pressed')}
          {console.log(specificCardID)}
          {/* <button type="button" onClick={clearSpecificCard}>Back</button>
          <div className={styles.status}>
            {specificCard && specificCard.fields.Active
              ? <div className={styles.statusChildInProgress}>In Progress</div>
              : <div className={styles.statusChildFulfilled}>Fulfilled</div>}
          </div>
          <div>
            Order placed on
            {' '}
            {specificCard && specificCard.fields.Date}
          </div>
          <table>
            <thead>
              <tr>
                <th width="263px">Student&apos;s First Name and Last Name</th>
                <th width="100px">Age</th>
                <th width="60px">Gender</th>
                <th width="100px">Shoe Size</th>
                <th width="70px">Wide Width?</th>
                <th width="263px">Teacher or school?</th>
              </tr>
            </thead>
            <tbody>
              {display}
            </tbody>
          </table> */}
          <button type="button" onClick={clearSpecificCard}>Back</button>
          {console.log(specificCardID)}
          {OrderListAdmin(specificCardID)}
        </>
      )
  );
}

export default OrderHistory;
