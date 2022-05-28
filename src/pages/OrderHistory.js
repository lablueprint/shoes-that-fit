// import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../components/card';
import styles from './OrderHistory.module.css';
import Details from '../components/details';

function OrderHistory({ base, profile, username }) {
  const [cards, setCards] = useState([]);
  const [specificCardID, setSpecificCardID] = useState('');

  const getCards = () => {
    base('Orders').select({ view: 'Grid view' }).all()
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
          <div className={styles.top}>
            <div className={styles.title}>Order History</div>
            <div className={styles.name}>{profile.contactName}</div>
          </div>
          <div className={styles.secondTop}>
            <Link to="/orderform"><button type="button" className={styles.placeOrder}> + Place Order</button></Link>
          </div>
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
        <Details
          id={specificCardID}
          base={base}
          clearSpecificCard={clearSpecificCard}
          username={username}
        />
      )
  );
}

OrderHistory.propTypes = {
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

export default OrderHistory;
