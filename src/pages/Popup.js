import React from 'react';
import PropTypes from 'prop-types';
import styles from './Popup.module.css';

function Message({ success, message }) {
  return (success) ? (
    <div>
      <h2>Success!</h2>
      <p>{message}</p>
    </div>
  ) : (
    <div>
      <h2>Invalid Input</h2>
      <p>{message}</p>
    </div>
  );
}

function Popup({
  closePopup, success, message,
}) {
  return (
    <div className={styles.popup}>
      <div className={styles['popup-inner']}>
        <Message success={success} message={message} />
        <button onClick={closePopup} type="submit" className={styles['close-btn']}>Close</button>
      </div>
    </div>
  );
}

Message.propTypes = {
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

Popup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

export default Popup;
