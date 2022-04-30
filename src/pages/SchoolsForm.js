import React, { useState } from 'react';
//  import reactDom from 'react-dom';
import styles from './SchoolsForm.module.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(
  airtableConfig.baseKey,
);

function OrderForm() {
  const [error, setError] = useState('');

  const [schoolName, setschoolName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  function pushToAirtable() {
    console.log({
      School: schoolName,
      Address1: address,
      City: city,
      State: state,
      'Zip Code': zip,
      'Contact Name': contact,
      'Email Address': email,
      Phone: phone,
    });
    base('Schools').create(
      [
        {
          fields: {
            School: schoolName,
            Address1: address,
            City: city,
            State: state,
            'Zip Code': zip,
            'Contact Name': contact,
            'Email Address': email,
            Phone: phone,
          },
        },
      ],
      (err, records) => {
        if (err) {
          console.error(err);
          setError(<p>{err.message}</p>);
          console.error(error);
          return;
        }
        records.forEach((record) => {
          console.log(record.getId());
        });
      },
    );
    setschoolName('');
    setAddress('');
    setCity('');
    setState('');
    setZip('');
    setContact('');
    setEmail('');
    setPhone('');
  }

  //   const errorStyle = {
  //     color: 'red',
  //   };

  return (
    <div className={styles.orderFormContainer}>
      <script src="print.js" />
      <form>
        <div className="row">
          <div className="column" />
          <div className="column" />
        </div>
      </form>
      <button
        type="submit"
        id="bigSubmit"
        name="bigsubmit"
        onClick={pushToAirtable}
        className={styles.bigSubmit}
      >
        {' '}
        Submit Form
      </button>
    </div>
  );
}

export default OrderForm;
