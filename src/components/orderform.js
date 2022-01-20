import React, { useEffect, useState } from 'react';
import Card from './card';

export default function OrderForm() {
  const [cards, setCards] = useState([]);
  const getCards = () => {
    console.log('hello');
  };

  const shoeUpdate = (evt) => {
    evt.preventDefault();
    console.log('console');
    const card = {};

    const shoes = [];
    const shoe = {};
    const size = document.getElementById('shoeSize');
    shoe.shoeSize = [size.value];

    const quant = document.getElementById('quantity');
    shoe.quantity = [quant.value];

    const shoeBrand = document.getElementById('shoeBrand');
    shoe.shoeBrand = shoeBrand.value;

    shoes.push(shoe);
    card.shoes = shoes;

    const schoolCard = document.getElementById('school');
    card.school = schoolCard.value;

    const firstNameCard = document.getElementById('firstName');
    card.firstName = firstNameCard.value;

    const lastNameCard = document.getElementById('lastName');
    card.lastName = lastNameCard.value;

    const emailCard = document.getElementById('email');
    card.email = emailCard.value;

    const phoneCard = document.getElementById('phone');
    card.phone = phoneCard.value;

    setCards((prev) => [...prev, card]);

    console.log(card);
    console.log(cards);

    getCards();
  };

  useEffect(getCards, []);

  return (
    <>
      <form onSubmit={shoeUpdate}>
        <label htmlFor="school">
          School:
          <input type="text" id="school" name="school" />
        </label>

        <label htmlFor="firstName">
          First name:
          <input type="text" id="firstName" name="firstName" />
        </label>

        <label htmlFor="lastName">
          Last name:
          <input type="text" id="lastName" name="lname" />
        </label>

        <label htmlFor="email">
          Email:
          <input type="text" id="email" name="email" />
        </label>

        <label htmlFor="phone">
          Phone:
          <input type="text" id="phone" name="phone" />
        </label>

        <label htmlFor="shoeBrand">
          Shoe Brand:
          <input type="text" id="shoeBrand" name="shoeBrand" />
        </label>

        <label htmlFor="shoeSize">
          Shoe Size:
          <input type="text" id="shoeSize" name="shoeSize" />
        </label>

        <label htmlFor="quantity">
          Quantity:
          <input type="integer" id="quantity" name="quantity" />
        </label>

        <input type="submit" id="submit" name="submit" />
      </form>
      <p>Update print cards</p>
      {cards.map((card, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <p> Hello </p>
          <Card
            school={card.school}
            firstName={card.firstName}
            lastName={card.lastName}
            email={card.email}
            phone={card.phone}
            shoes={card.shoes}
          />
        </div>
      ))}
    </>
  );
}
