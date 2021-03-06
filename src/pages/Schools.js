import React, { useState, useEffect } from 'react';
//  import reactDom from 'react-dom';
import PropTypes from 'prop-types';
import { Table } from '../components';
import SchoolsDetail from './SchoolsDetail';

function Schools({ base }) {
  const [cards, setCards] = useState([]);
  const [curCard, setCurCard] = useState('');

  const headers = ['School Name', 'Point of Contact', 'Email Address', 'Phone Number', 'Details'];
  // card.Orders will go into details page, unsure how to implement this right now
  const dataProps = ['School Name', 'Point of Contact', 'Email Address', 'Phone Number', 'Details', 'ID'];
  const dataKeyProp = 'ID';
  const sortIndices = [0, 1];

  const getCards = () => {
    base('Schools')
      .select({ view: 'Grid view' })
      .all()
      .then((records) => {
        setCards(records.map((r) => (r.fields)).map((x) => ({
          'School Name': x.School,
          'Point of Contact': `${x['First Name']} ${x['Last Name']}`,
          'Email Address': x['Email Address'],
          'Phone Number': x.Phone,
          ID: x.ID,
        })));
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  const clearCurCards = () => {
    setCurCard('');
  };

  return (
    curCard === ''
      ? cards && cards.length > 0 && (
      <Table
        headers={headers}
        sortIndices={sortIndices}
        data={cards}
        dataProps={dataProps}
        dataKeyProp={dataKeyProp}
        selectCard={setCurCard}
        details
      />
      )
      : <SchoolsDetail id={curCard.ID} backButton={clearCurCards} base={base} />

  );
}

export default Schools;

Schools.propTypes = {
  base: PropTypes.func.isRequired,
};
