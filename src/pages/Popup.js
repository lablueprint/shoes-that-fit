import React from 'react';
import PropTypes from 'prop-types';
import './Popup.css';

function Message({ success, quantityDisplay }) {
  return (success) ? (
    <div>
      <h2>
        New quanity:
        {' '}
        {quantityDisplay}
      </h2>
    </div>
  ) : (
    <div>
      <h2>Invalid Input</h2>
    </div>
  );
}

function Popup({ closePopup, success, value }) {
  console.log((value));
  return (
    <div className="popup">
      <div className="popup-inner">
        <Message success={success} quantityDisplay={value} />
        <button onClick={closePopup} type="submit" className="close-btn">Close</button>
      </div>
    </div>
  );
}

Message.propTypes = {
  success: PropTypes.func.isRequired,
  quantityDisplay: PropTypes.func.isRequired,
};

Popup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired,
  value: PropTypes.func.isRequired,
};

export default Popup;
