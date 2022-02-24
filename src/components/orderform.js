import React, { useState, useEffect } from 'react';
// import reactDom from 'react-dom';
import Card from './card';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

export default function OrderForm() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState();

  const getCards = () => {
    base('Orders').select({ view: 'Grid view' }).all()
      .then((records) => {
        setCards(records);
      });
    console.log(cards);
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

    const wideWidth = parseInt(document.getElementById('wideWidth'), 10);
    card.wideWidth = wideWidth;

    const size = parseInt(document.getElementById('size'), 10);
    card.size = size;

    const age = parseInt(document.getElementById('age'), 10);
    card.age = age;

    const school = document.getElementById('school').value;
    card.school = school;

    base('Orders').create([
      {
        fields: {
          Name: name,
          Size: size,
          'Teacher/School': school,
          Age: age,
          Gender: gender,
          Wide: wideWidth,
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

    getCards();
  };

  const orderformStyle = {
    'text-align': 'left',
    'padding-left': '30%',
    'padding-right': '30%',
  };

  const errorStyle = {
    color: 'red',
  };

  return (
    <div>
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
              Wide Width:
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
          <input required type="text" id="age" name="age" />
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

      <div style={errorStyle}>
        {error}
      </div>

      <h1>Active orders: </h1>
      {cards.filter((card) => (card.fields.Active === 'y')).map((card, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <p />
          <Card
            name={card.fields.nAME}
            gender={card.fields.Gender}
            wideWidth={card.fields.Wide}
            size={card.fields.Size}
            age={card.fields.Age}
            school={card.fields['Teacher/School']}
            shoeSize={card.fields.Active}
          />
        </div>
      ))}

      <h1>Archived orders: </h1>
      {cards.filter((card) => (card.fields.Active === 'n')).map((card, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <p />
          <Card
            name={card.fields.nAME}
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
  );
}
