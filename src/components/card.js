import React from 'react';
import PropTypes from 'prop-types';
import styles from './card.module.css';

function Card({
  schoolDistrict,
  time,
  fulfilled,
  cardId,
  deleteCard,
  selectCard,
}) {
  function deleteMyself() {
    deleteCard(cardId);
  }

  function viewForm() {
    console.log(cardId);
    selectCard(cardId);
  }

  return (
    <div className={styles.cardBackground}>
      <div className={styles.leftText}>
        <div className={styles.schoolDistrict}>{schoolDistrict}</div>
        <div className={styles.order}>
          Order placed on
          {' '}
          {new Date(Date.parse(time)).toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
        <div className={styles.statusTime}>
          <div className={styles.status}>
            {fulfilled ? <div className={styles.statusChildInProgress}>In Progress</div>
              : <div className={styles.statusChildFulfilled}>Fulfilled</div>}
          </div>
          <div className={styles.time}>
            {`${new Date(Date.parse(time)).toLocaleString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })} | ${new Date(Date.parse(time)).toLocaleString('en-US', {
              hour: 'numeric', minute: 'numeric',
            })}`}
          </div>
        </div>
      </div>
      <button type="button" className={styles.delete} onClick={deleteMyself}> Delete </button>
      <button type="button" className={styles.viewForm} onClick={viewForm}> View Form</button>
    </div>
  );
}

Card.propTypes = {
  schoolDistrict: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  fulfilled: PropTypes.bool,
  cardId: PropTypes.string.isRequired,
  deleteCard: PropTypes.func.isRequired,
  selectCard: PropTypes.func.isRequired,
};

Card.defaultProps = {
  fulfilled: false,
};

export default Card;
