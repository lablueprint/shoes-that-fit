import React from 'react';
import PropTypes from 'prop-types';
import styles from './card.module.css';

function Card({
  schoolDistrict,
  time,
  fulfilled,
}) {
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

        <div className={styles.status}>
          {fulfilled ? <div className={styles.statusChildInProgress}>In Progress</div>
            : <div className={styles.statusChildFulfilled}>Fulfilled</div>}
        </div>
      </div>
      <button type="button" className={styles.delete}> Delete </button>
      <button type="button" className={styles.viewForm}> View Form</button>
    </div>
  );
}

Card.propTypes = {
  schoolDistrict: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  fulfilled: PropTypes.bool,
};

Card.defaultProps = {
  fulfilled: false,
};

export default Card;
