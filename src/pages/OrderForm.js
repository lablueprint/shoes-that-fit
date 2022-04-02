import React, { useState, useEffect } from 'react';
import print from 'print-js';
// import reactDom from 'react-dom';
import Card from '../components/card';
import './OrderForm.css';

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

  const orderformStyle = {
    textAlign: 'left',
    paddingLeft: '30%',
    paddingRight: '30%',
  };

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
    <div>
      {getId()}
      <script src="print.js" />
      <h1>Submit your order here: </h1>
      <form style={orderformStyle} onSubmit={shoeUpdate}>
        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="school">
              School:
              {' '}
            </label>
          </div>
          <input required type="text" id="school" name="school" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="name">
              First Name and Last Initial:
              {' '}
            </label>
          </div>
          <input required type="text" id="name" name="name" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="gender">
              Gender:
              {' '}
            </label>
          </div>
          <input required type="text" id="gender" name="gender" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="wideWidth">
              Wide Width (y/n):
              {' '}
            </label>
          </div>
          <input required type="boolean" id="wideWidth" name="wideWidth" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="size">
              Size:
              {' '}
            </label>
          </div>
          <input required type="number" id="size" name="size" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="age">
              Age:
              {' '}
            </label>
          </div>
          <input required type="number" id="age" name="age" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="school">
              School or Teacher:
              {' '}
            </label>
          </div>
          <input required type="string" id="school" name="school" min="1" />
        </div>
        <input type="submit" id="submit" name="submit" />
      </form>

      <button type="submit" id="bigSubmit" name="bigsubmit" onClick={pushToAirtable}> Submit all orders </button>

      <div style={errorStyle}>
        {error}
      </div>

      <button type="button" onClick={printForm}>
        Print Form
      </button>
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
            {/* <div>
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
            </div> */}
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
  );
}

export default OrderForm;
