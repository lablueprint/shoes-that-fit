import React from 'react';
import PropTypes from 'prop-types';

function Card({
  name, gender, wideWidth, size, age, school,
}) {
  const cardStyle = {
    textAlign: 'left',
    paddingLeft: '30%',
    paddingRight: '30%',
  };
  return (
    <div style={cardStyle}>
      <div>
        First Name and Last Initial:
        {' '}
        {name}
      </div>
      <div>
        Gender:
        {' '}
        {gender}
      </div>
      <div>
        Wide Width:
        {' '}
        {wideWidth ? 'True' : 'False'}
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
  wideWidth: PropTypes.bool,
  size: PropTypes.number.isRequired,
  age: PropTypes.number.isRequired,
};

Card.defaultProps = {
  school: 'UCLA',
  wideWidth: false,
};

export default Card;
