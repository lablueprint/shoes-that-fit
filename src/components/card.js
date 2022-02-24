import React from 'react';
import PropTypes from 'prop-types';

function Card({
  name, gender, wideWidth, size, age, school,
}) {
  const cardStyle = {
    'text-align': 'left',
    'padding-left': '30%',
    'padding-right': '30%',
  };
  return (
    <div style={cardStyle}>
      <div>
        First Name and Last Initial:
        {' '}
        {name}
      </div>
      <div>
        gender:
        {' '}
        {gender}
      </div>
      <div>
        Wide Width:
        {' '}
        {wideWidth}
      </div>
      <div>
        Shoe Size:
        {' '}
        {size}
      </div>
      <div>
        Age:
        {' '}
        {age}
      </div>
      <div>
        School:
        {' '}
        {school}
      </div>
    </div>
  );
}

Card.propTypes = {
  school: PropTypes.string,
  name: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  wideWidth: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  age: PropTypes.number.isRequired,
};

Card.defaultProps = {
  school: 'UCLA',
};

export default Card;
