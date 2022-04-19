import React from 'react';
import PropTypes from 'prop-types';
import './Popup.css';

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
    <div className="popup">
      <div className="popup-inner">
        <Message success={success} message={message} />
        <button onClick={closePopup} type="submit" className="close-btn">Close</button>
      </div>
    </div>
  );
}

Popup.propTypes = {
  closePopup: PropTypes.func.isRequired,
};

export default Popup;
