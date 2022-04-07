import React, { useState } from 'react';
import print from 'print-js';
// import reactDom from 'react-dom';
import './OrderForm.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(
  airtableConfig.baseKey,
);

function OrderForm() {
  const [curcards, setcurCards] = useState([]);
  const [error, setError] = useState();

  const shoeUpdate = (evt) => {
    evt.preventDefault();
    const card = {};

    const name = document.getElementById('name').value;
    card.name = name;

    const gender = document.getElementById('gender').value;
    card.gender = gender;

    let wideWidth = document.getElementById('wideWidth');
    if (
      wideWidth === 'y'
      || wideWidth === 'Y'
      || wideWidth === 'yes'
      || wideWidth === 'YES'
    ) {
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

    const note = document.getElementById('notes').value;
    card.note = note;

    setcurCards((prev) => [...prev, card]);
  };

  function pushToAirtable() {
    curcards.map((card) => {
      base('Orders').create(
        [
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
      return 0;
    });
    // setcurCards([]);
  }

  const errorStyle = {
    color: 'red',
  };

  function printForm() {
    print({ printable: 'orders', type: 'html' });
  }

  return (
    <div className="row">
      <script src="print.js" />
      <div className="column left">
        <div className="left-column">
          <form onSubmit={shoeUpdate}>
            <label htmlFor="name">
              Student&apos;s First Name & Last Initial:
            </label>
            <div />
            <input
              className="full"
              required
              type="text"
              id="name"
              name="name"
            />
            <div className="space" />

            <div className="flex-container">
              <div className="flex-child label">
                <label htmlFor="age">Age: </label>
                <div />
                <input
                  className="half"
                  required
                  type="number"
                  id="age"
                  name="age"
                />
              </div>
              <div className="flex-child label">
                <label htmlFor="gender">Gender: </label>
                <div />
                <input
                  className="half"
                  required
                  type="text"
                  id="gender"
                  name="gender"
                />
              </div>
            </div>
            <div className="space" />

            <div className="flex-container">
              <div className="flex-child label">
                <label htmlFor="size">Size: </label>
                <div />
                <input
                  className="half"
                  required
                  type="number"
                  id="size"
                  name="size"
                />
              </div>
              <div className="flex-child label">
                <label htmlFor="wideWidth">Wide Width?: </label>
                <div />
                <input
                  className="half"
                  required
                  type="boolean"
                  id="wideWidth"
                  name="wideWidth"
                />
              </div>
            </div>
            <div className="space" />

            <label htmlFor="school">Teacher / School (if applicable) </label>
            <input
              className="full"
              required
              type="string"
              id="school"
              name="school"
            />
            <div className="space" />
            <input
              type="submit"
              id="submit"
              name="submit"
              value="Add Request"
            />
          </form>

          <div style={errorStyle}>{error}</div>
        </div>
      </div>

      <div className="column right">
        <div className="right-column">
          <div id="orders">
            <div className="container">
              <table>
                <thead>
                  <tr>
                    <th width="263px">
                      Student&apos;s First Name and Last Name
                    </th>
                    <th width="100px">Age</th>
                    <th width="60px">Gender</th>
                    <th width="100px">Shoe Size</th>
                    <th width="70px">Wide Width?</th>
                    <th width="263px">Teacher or school?</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log(curcards)}
                  {curcards.length > 0
                    && curcards.map((card, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <tr key={index}>
                        <td>{card.name}</td>
                        <td>{card.age}</td>
                        <td>{card.gender}</td>
                        <td>{card.size}</td>
                        <td>{card.wide}</td>
                        <td>{card.school}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="michael">
                <button
                  type="submit"
                  id="bigSubmit"
                  name="bigsubmit"
                  onClick={pushToAirtable}
                >
                  {' '}
                  Submit Form
                </button>

                <button
                  type="button"
                  id="print"
                  name="print"
                  onClick={printForm}
                >
                  Print Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
