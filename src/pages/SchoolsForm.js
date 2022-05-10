import React, { useState } from 'react';
//  import reactDom from 'react-dom';
import { ChevronLeft } from 'lucide-react';
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
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  function pushToAirtable() {
    console.log({
      School: schoolName,
      Address1: address,
      City: city,
      State: state,
      'Zip Code': zip,
      'First Name': first,
      'Last Name': last,
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
            'First Name': first,
            'Last Name': last,
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
    setFirst('');
    setLast('');
    setEmail('');
    setPhone('');
  }

  //   const errorStyle = {
  //     color: 'red',
  //   };

  return (
    <div className={styles.orderFormContainer}>
      <script src="print.js" />
      <div className={styles.header}>
        <ChevronLeft size={30} type="button" />
        Directory
      </div>
      <form>
        <div className={styles.column}>
          <div className={styles.sub}>
            Schools Information
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <label htmlFor="name">School Name:</label>
              <input
                className={styles.full}
                required
                type="text"
                id="schoolName"
                name="schoolName"
                value={schoolName}
                onChange={(e) => setschoolName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <label htmlFor="name">Address:</label>
              <input
                className={styles.full}
                required
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <label htmlFor="name">City:</label>
              <input
                className={styles.half}
                required
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className={styles.column}>
              <label htmlFor="name">State:</label>
              <input
                className={styles.half}
                required
                type="text"
                id="state"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <label htmlFor="name">Zip Code:</label>
              <input
                className={styles.half}
                required
                type="text"
                id="zip"
                name="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.sub}>
            Personal Information
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <label htmlFor="name">First Name:</label>
              <input
                className={styles.half}
                required
                type="text"
                id="first"
                name="first"
                value={first}
                onChange={(e) => setFirst(e.target.value)}
              />
            </div>
            <div className={styles.column}>
              <label htmlFor="name">Last Name:</label>
              <input
                className={styles.half}
                required
                type="text"
                id="last"
                name="last"
                value={last}
                onChange={(e) => setLast(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <label htmlFor="name">Phone:</label>
              <input
                className={styles.full}
                required
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <label htmlFor="name">Email:</label>
              <input
                className={styles.full}
                required
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
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
