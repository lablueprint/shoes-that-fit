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

    const size = parseInt(document.getElementById('shoeSize').value, 10);
    card.shoeSize = size;

    const quant = parseInt(document.getElementById('quantity').value, 10);
    card.quantity = quant;

    const shoeBrand = document.getElementById('shoeBrand').value;
    card.shoeBrand = shoeBrand;

    const schoolCard = document.getElementById('school').value;
    card.school = schoolCard;

    const firstNameCard = document.getElementById('firstName').value;
    card.firstName = firstNameCard;

    const lastNameCard = document.getElementById('lastName').value;
    card.lastName = lastNameCard;

    const emailCard = document.getElementById('email').value;
    card.email = emailCard;

    const phoneCard = document.getElementById('phone').value;
    card.phone = phoneCard;

    base('Orders').create([
      {
        fields: {
          School: schoolCard,
          'First Name': firstNameCard,
          'Last Name': lastNameCard,
          Email: emailCard,
          Phone: phoneCard,
          'Shoe Brand': shoeBrand,
          'Shoe Size': size,
          Quantity: quant,
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
            <label htmlFor="firstName">
              First name:
              {' '}
            </label>
          </div>
          <input required type="text" id="firstName" name="firstName" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="lastName">
              Last name:
              {' '}
            </label>
          </div>
          <input required type="text" id="lastName" name="lname" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="email">
              Email:
              {' '}
            </label>
          </div>
          <input required type="text" id="email" name="email" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="phone">
              Phone:
              {' '}
            </label>
          </div>
          <input required type="text" id="phone" name="phone" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="shoeBrand">
              Shoe Brand:
              {' '}
            </label>
          </div>
          <input required type="text" id="shoeBrand" name="shoeBrand" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="shoeSize">
              Shoe Size:
              {' '}
            </label>
          </div>
          <input required type="text" id="shoeSize" name="shoeSize" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="quantity">
              Quantity:
              {' '}
            </label>
          </div>
          <input required type="number" id="quantity" name="quantity" min="1" />
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
            school={card.fields.School}
            firstName={card.fields['First Name']}
            lastName={card.fields['Last Name']}
            email={card.fields.Email}
            phone={card.fields.Phone}
            shoeBrand={card.fields['Shoe Brand']}
            shoeSize={card.fields['Shoe Size']}
            quantity={card.fields.Quantity}
          />
        </div>
      ))}

      <h1>Archived orders: </h1>
      {cards.filter((card) => (card.fields.Active === 'n')).map((card, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <p />
          <Card
            school={card.fields.School}
            firstName={card.fields['First Name']}
            lastName={card.fields['Last Name']}
            email={card.fields.Email}
            phone={card.fields.Phone}
            shoeBrand={card.fields['Shoe Brand']}
            shoeSize={card.fields['Shoe Size']}
            quantity={card.fields.Quantity}
          />
        </div>
      ))}
    </div>
  );
}
