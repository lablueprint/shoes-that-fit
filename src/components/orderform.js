import React from 'react';

const shoes = [];
const shoeSize = [];
const quantity = [];

const Shoeupdate = () => {
  console.log('console');

  const size = document.getElementById('shoeSize');
  console.log(size);

  if (size) {
    const sizeVal = size.value;
    console.log(sizeVal);
    shoeSize.push(sizeVal);
  }

  const quant = document.getElementById('quantity');
  if (quant) {
    const quantVal = quant.value;
    console.log(quantVal);
    quantity.push(quantVal);
  }

  const shoeBrand = document.getElementById('shoeBrand');
  if (shoeBrand) {
    const shoeBrandVal = shoeBrand.value;
    console.log(shoeBrandVal);
    shoes.push(shoeBrandVal);
    shoes.push(shoeSize);
    shoes.push(quantity);
  }

  console.log('hello');
  console.log(shoes);
};

export default function Orderform() {
  return (
    <form onSubmit={Shoeupdate}>
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
  );
}
