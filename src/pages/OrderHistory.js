// import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import Card from '../components/card';
import styles from './OrderHistory.module.css';
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

  const getCards = () => {
    base('Orders').select({ view: 'Grid View' }).all()
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
    setSpecificCardID(cardID);
  };

  const clearSpecificCard = () => {
    setSpecificCardID('');
  };

  return (
    specificCardID === ''
      ? (
        <div className={styles.orderHistory}>
          <div className={styles.orderText}>Orders in Progress</div>

          {cards.filter((card) => (card.fields.UserID === '1' && card.fields.Active === true)).length === 0
            ? <div className={styles.no}>No orders in progress.</div>
            : cards.filter((card) => (card.fields.UserID === '1' && card.fields.Active === true)).map((card) => (
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
          {cards.filter((card) => (card.fields.UserID === '1' && !(card.fields.Active === true))).length === 0
            ? <div className={styles.no}>No previous orders.</div>
            : cards.filter((card) => (card.fields.UserID === '1' && !(card.fields.Active === true))).map((card) => (
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
          <div className={styles.back}>
            <ChevronLeft size={50} type="button" onClick={clearSpecificCard} />
          </div>
          <OrderListAdmin id={specificCardID} />
        </>
      )
  );
}

export default OrderHistory;
