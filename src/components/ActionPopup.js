import React from 'react';
import PropTypes from 'prop-types';
import styles from './ActionPopup.module.css';

function ActionMessage({ success, message }) {
  return (success) ? (
    <div>
      <h2>Success!</h2>
      <p>{message}</p>
    </div>
  ) : (
    <div>
      <h2>Please Confirm:</h2>
      <p>{message}</p>
    </div>
  );
}

function ActionPopup({
  // eslint-disable-next-line no-unused-vars
  closePopup, success, message, applyFunc,
}) {
//   const deleteItems = (() => {

  //   });
  return (
    <div className={styles.popup}>
      <div className={styles['popup-inner']}>
        <ActionMessage success={success} message={message} />
        { !success && (<button onClick={applyFunc} type="submit" className={styles['delete-btn']}>Delete</button>)}

        <button onClick={closePopup} type="submit" className={styles['close-btn']}>Close</button>
      </div>
    </div>
  );
}

ActionMessage.propTypes = {
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

ActionPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  applyFunc: PropTypes.func.isRequired,
};

export default ActionPopup;
