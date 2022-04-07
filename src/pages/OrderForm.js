/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import React, { useState, useEffect } from 'react';
import print from 'print-js';
// import reactDom from 'react-dom';
import Card from '../components/card';
import styles from './OrderForm.module.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function OrderForm() {
  const [cards, setCards] = useState([]);
  const [curcards, setcurCards] = useState([]);
  const [error, setError] = useState();
  let uniqueActive = [];
  let uniqueInactive = [];

  const getCards = () => {
    base('Orders').select({ view: 'Grid view' }).all()
      .then((records) => {
        setCards(records);
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  const shoeUpdate = (evt) => {
    evt.preventDefault();
    const card = {};

    const name = document.getElementById('name').value;
    card.name = name;

    const gender = document.getElementById('gender').value;
    card.gender = gender;

    let wideWidth = document.getElementById('wideWidth');
    if (wideWidth === 'y' || wideWidth === 'Y' || wideWidth === 'yes' || wideWidth === 'YES') {
      wideWidth = true;
    } else {
      wideWidth = false;
    }
    card.wideWidth = wideWidth;

    const size = parseInt(document.getElementById('size').value, 10);
    card.size = size;

    const age = parseInt(document.getElementById('age').value, 10);
    card.age = age;

    const school = document.getElementById('school').value;
    card.school = school;
    curcards.push(card);
    setcurCards(curcards);
  };

  function pushToAirtable() {
    curcards.map((card) => {
      base('Orders').create([
        {
          fields: {
            Name: card.name,
            Size: card.size,
            'Teacher/School': card.school,
            Age: card.age,
            Gender: card.gender,
            Wide: card.wideWidth,
            Active: 'y',
          },
        },
      ], (err, records) => {
        if (err) {
          console.error(err);
          setError(
            <p>
              {err.message}
            </p>,
          );
          console.error(error);
          return;
        }
        records.forEach((record) => {
          console.log(record.getId());
        });
      });
      return 0;
    });
    setcurCards([]);
    getCards();
  }

  const errorStyle = {
    color: 'red',
  };

  function printForm() {
    print({ printable: 'orders', type: 'html' });
  }

  const getId = () => {
    uniqueActive = [...new Set(cards.filter((card) => (card.fields.Active === 'y')).map((card) => card.fields.Time))];
    uniqueInactive = [...new Set(cards.filter((card) => (card.fields.Active === 'n')).map((card) => card.fields.Time))];
  };

  return (
    <div className={styles.row}>
      {getId()}
      <script src="print.js" />
      <div className={[styles.column, styles.left]}>
        <div className={styles.leftColumn}>
          <h1>Add Order: </h1>
          <form onSubmit={styles.shoeUpdate}>
            <label htmlFor="name">
              Student&apos;s First Name & Last Initial:
            </label>
            <div />
            <input className={styles.full} required type="text" id="name" name="name" />
            <div className={styles.space} />

            <div className={styles.flexContainer}>
              <div className={[styles.flexChild, styles.label]}>
                <label htmlFor="age">
                  Age
                  {' '}
                </label>
                <div />
                <input className={styles.half} required type="number" id="age" name="age" />
              </div>
              <div className={[styles.flexChild, styles.label]}>
                <label htmlFor="gender">
                  Gender
                  {' '}
                </label>
                <div />
                <input className={styles.half} required type="text" id="gender" name="gender" list="genders" />
                <datalist id="genders">
                  <option value="Male"> </option>
                  <option value="Female"> </option>
                  <option value="Other"> </option>
                </datalist>
              </div>
            </div>
            <div className="space" />

            <div className="flex-container">
              <div className="flex-child label">
                <label htmlFor="size">
                  Size
                  {' '}
                </label>
                <div />
                <input className="half" required type="text" id="size" name="size" list="sizes" />
                <datalist id="sizes">
                  <option value="Young Child 4"> </option>
                  <option value="Young Child 4.5"> </option>
                  <option value="Young Child 5"> </option>
                  <option value="Young Child 5.5"> </option>
                  <option value="Young Child 6"> </option>
                  <option value="Young Child 6.5"> </option>
                  <option value="Young Child 7"> </option>
                  <option value="Young Child 7.5"> </option>
                  <option value="Young Child 8"> </option>
                  <option value="Young Child 8.5"> </option>
                  <option value="Young Child 9"> </option>
                  <option value="Young Child 9.5"> </option>
                  <option value="Young Child 10"> </option>
                  <option value="Young Child 10.5"> </option>
                  <option value="Young Child 11"> </option>
                  <option value="Young Child 11.5"> </option>
                  <option value="Young Child 12"> </option>
                  <option value="Young Child 12.5"> </option>
                  <option value="Young Child 13"> </option>
                  <option value="Young Child 13.5"> </option>
                  <option value="Youth 1"> </option>
                  <option value="Youth 1"> </option>
                  <option value="Youth 1.5"> </option>
                  <option value="Youth 1.5"> </option>
                  <option value="Youth 2"> </option>
                  <option value="Youth 2"> </option>
                  <option value="Youth 2.5"> </option>
                  <option value="Youth 2.5"> </option>
                  <option value="Youth 3"> </option>
                  <option value="Youth 3"> </option>
                  <option value="Youth 3.5"> </option>
                  <option value="Youth 3.5"> </option>
                  <option value="Youth 4"> </option>
                  <option value="Youth 4"> </option>
                  <option value="Youth 4.5"> </option>
                  <option value="Youth 4.5"> </option>
                  <option value="Adult 5"> </option>
                  <option value="Adult 5"> </option>
                  <option value="Adult 5.5"> </option>
                  <option value="Adult 5.5"> </option>
                  <option value="Adult 6"> </option>
                  <option value="Adult 6"> </option>
                  <option value="Adult 6.5"> </option>
                  <option value="Adult 6.5"> </option>
                  <option value="Adult 7"> </option>
                  <option value="Adult 7"> </option>
                  <option value="Adult 7.5"> </option>
                  <option value="Adult 7.5"> </option>
                  <option value="Adult 8"> </option>
                  <option value="Adult 8"> </option>
                  <option value="Adult 8.5"> </option>
                  <option value="Adult 8.5"> </option>
                  <option value="Adult 9"> </option>
                  <option value="Adult 9"> </option>
                  <option value="Adult 9.5"> </option>
                  <option value="Adult 9.5"> </option>
                  <option value="Adult 10"> </option>
                  <option value="Adult 10"> </option>
                  <option value="Adult 10.5"> </option>
                  <option value="Adult 10.5"> </option>
                  <option value="Adult 11"> </option>
                  <option value="Adult 11"> </option>
                  <option value="Adult 11.5"> </option>
                  <option value="Adult 11.5"> </option>
                  <option value="Adult 12"> </option>
                  <option value="Adult 12"> </option>
                  <option value="Adult 12.5"> </option>
                  <option value="Adult 12.5"> </option>
                  <option value="Adult 13"> </option>
                  <option value="Adult 13"> </option>
                  <option value="Adult 13.5"> </option>
                  <option value="Adult 13.5"> </option>
                  <option value="Adult 14"> </option>
                  <option value="Adult 14"> </option>
                  <option value="Adult 15"> </option>
                  <option value="Adult 15"> </option>
                </datalist>
              </div>
              {' '}
              <div className="flex-child label">
                <label htmlFor="wideWidth">
                  Wide Width?
                  {' '}
                </label>
                <div />
                <input className="half" required type="boolean" id="wideWidth" name="wideWidth" list="yesorno" />
                <datalist id="yesorno">
                  <option value="Yes"> </option>
                  <option value="No"> </option>
                </datalist>
              </div>
            </div>
            <div className="space" />

            <label htmlFor="school">
              Teacher / School (if applicable)
              {' '}
            </label>
            <input className="full" required type="string" id="school" name="school" />
            <div className="space" />

            <input type="submit" id="submit" name="submit" value="Add Request" />
          </form>

          <button type="submit" id="bigSubmit" name="bigsubmit" onClick={pushToAirtable}> Submit all orders </button>

          <div style={errorStyle}>
            {error}
          </div>

          <button type="button" onClick={printForm}>
            Print Form
          </button>
        </div>
      </div>

      <div className="column right">
        <div className="right-column">

          <div id="orders">
            <h1>Active orders: </h1>
            {uniqueActive.map((value) => (
              <div>
                <h2>
                  <text>
                    ID:
                    {'\n\n\n\n'}
                    {new Date(Date.parse(value)).toLocaleString('en-US')}
                  </text>
                  <text>
                    {'\n\n\n\n'}
                    Quantity:
                    {cards.filter((card) => card.fields.Time === `${value}`).length}
                  </text>
                </h2>

                <div className="container">
                  <table>
                    <thead>
                      <tr>
                        <th>Student&apos;s First Name and Last Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Shoe Size</th>
                        <th>Wide Width?</th>
                        <th>Teacher or school?</th>
                        <th>Notes or Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cards.filter((card) => card.fields.Time === `${value}`).map((card, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <tr key={index}>
                          <td>{card.fields.Name}</td>
                          <td>{card.fields.Age}</td>
                          <td>{card.fields.Gender}</td>
                          <td>{card.fields.Size}</td>
                          <td>{card.fields.Wide}</td>
                          <td>{card.fields['Teacher/School']}</td>
                          <td>{card.fields.Active}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <h1>Archived orders: </h1>
            {uniqueInactive.map((value) => (
              <div>
                <h2>
                  <text>
                    ID:
                    {'\n\n\n\n'}
                    {new Date(Date.parse(value)).toLocaleString('en-US')}
                  </text>
                  <text>
                    {'\n\n\n\n'}
                    Quantity:
                    {cards.filter((card) => card.fields.Time === `${value}`).length}
                  </text>
                </h2>

                <div>
                  {cards.filter((card) => card.fields.Time === `${value}`).map((card, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                      <p />
                      <Card
                        name={card.fields.Name}
                        gender={card.fields.Gender}
                        wideWidth={card.fields.Wide}
                        size={card.fields.Size}
                        age={card.fields.Age}
                        school={card.fields['Teacher/School']}
                        shoeSize={card.fields.Active}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
