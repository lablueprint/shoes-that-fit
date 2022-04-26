import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Donations() {
  const [donor, setDonor] = useState({});
  const [donations, setDonations] = useState([]);
  // const [error, setError] = useState('');
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setDonor(location.state.donor);
      setDonations(location.state.donations);
      console.log(location.state.donor);
      console.log(location.state.donations);
    } else {
      console.log('No donor/donations field');
    }
  }, []);

  const donorUpdate = (e) => {
    e.preventDefault();
    const tempDonor = {};
    tempDonor.name = document.getElementById('name').value;
    tempDonor.phone = document.getElementById('phone').value;
    tempDonor.email = document.getElementById('email').value;
    tempDonor.addressline1 = document.getElementById('addressline1').value;
    const addressline2Element = document.getElementById('addressline2');
    if (addressline2Element) {
      tempDonor.addressline2 = addressline2Element.value;
    } else {
      tempDonor.addressline2 = '';
    }
    tempDonor.city = document.getElementById('city').value;
    tempDonor.state = document.getElementById('state').value;
    const zipcode = parseInt(document.getElementById('zipcode').value, 10);
    if (!zipcode || zipcode < 10000 || zipcode > 99999) {
      console.log('Bad Zipcode');
      return;
    }
    tempDonor.zipcode = zipcode;
    setDonor(tempDonor);
  };

  const addDonation = (e) => {
    e.preventDefault();
    const donation = {};
    donation.Quantity = document.getElementById('quantity').value;
    donation.Gender = document.getElementById('gender').value;
    if (donation.Gender === 'none') {
      console.log('Select a gender');
      return;
    }
    donation.Category = document.getElementById('category').value;
    if (donation.Category === 'none') {
      console.log('Select a category');
      return;
    }
    donation.Size = document.getElementById('size').value;
    if (document.getElementById('wide').checked) {
      donation.Wide = 'W';
    } else {
      donation.Wide = 'NW';
    }
    donation.Notes = document.getElementById('notes').value;
    setDonations([...donations, donation]);
  };

  return (
    <div>
      <h1>Log a Donation</h1>
      <h2>Step 1. Add donor info</h2>
      <p>
        Name:
        {' '}
        {donor.name}
      </p>
      <p>
        Phone:
        {' '}
        {donor.phone}
      </p>
      <p>
        Email:
        {' '}
        {donor.email}
      </p>
      <p>
        Address Line 1:
        {' '}
        {donor.addressline1}
      </p>
      <p>
        Address Line 2:
        {' '}
        {donor.addressline2}
      </p>
      <p>
        City:
        {' '}
        {donor.city}
      </p>
      <p>
        State:
        {' '}
        {donor.state}
      </p>
      <p>
        Zip Code:
        {' '}
        {donor.zipcode}
      </p>
      <form onSubmit={donorUpdate}>
        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="name">
              Donor/organization name:
              {' '}
            </label>
          </div>
          <input required type="text" id="name" name="name" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="phone">
              Phone #:
              {' '}
            </label>
          </div>
          <input required type="text" id="phone" name="phone" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="email">
              Email address:
              {' '}
            </label>
          </div>
          <input required type="text" id="email" name="email" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="addressline1">
              Address line 1:
              {' '}
            </label>
          </div>
          <input required type="text" id="addressline1" name="addressline1" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="addressline2">
              Address line 2 (optional):
              {' '}
            </label>
          </div>
          <input type="text" id="addressline2" name="addressline2" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="city">
              City:
              {' '}
            </label>
          </div>
          <input required type="text" id="city" name="city" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="state">
              State:
              {' '}
            </label>
          </div>
          <input required type="text" id="state" name="state" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="zipcode">
              Zip code:
              {' '}
            </label>
          </div>
          <input required type="text" id="zipcode" name="zipcode" />
        </div>
        <input type="submit" id="save" name="save" value="Save" />
      </form>
      <h2>Step 2. Add donation info</h2>
      <table>
        <thead>
          <tr>
            {donationFields.map((field) => (
              <th>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr>
              {donationFields.map((field) => (
                <td>{donation[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={addDonation}>
        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="quantity">
              Quantity:
              {' '}
            </label>
          </div>
          <input required type="number" id="quantity" name="quantity" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="gender">
              Gender:
              {' '}
            </label>
          </div>
          {/* <input required type="text" id="gender" name="gender" /> */}
          <select name="gender" id="gender">
            <option value="none" selected disabled hidden>Select an Option</option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
          </select>
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="category">
              Category:
              {' '}
            </label>
          </div>
          {/* <input required type="text" id="category" name="category" /> */}
          <select name="category" id="category">
            <option value="none" selected disabled hidden>Select an Option</option>
            <option value="Infant/Child">Infant/Child</option>
            <option value="Youth">Youth</option>
            <option value="Adult">Adult</option>
          </select>
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="size">
              Size:
              {' '}
            </label>
          </div>
          <input required type="text" id="size" name="size" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="wide">
              Wide:
              {' '}
            </label>
          </div>
          <input type="checkbox" id="wide" name="wide" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="notes">
              Notes:
              {' '}
            </label>
          </div>
          <textarea required type="text" id="notes" name="notes" />
        </div>
        <input type="submit" id="add" name="add" value="Add" />
      </form>
      {/* <form onSubmit={submitDonations}>
        <input type="submit" id="submit" name="submit" value="Save and Continue" />
      </form> */}
      <Link to="/confirmdonation" state={{ valid: true, donor, donations }}>
        <input type="submit" id="submit" name="submit" value="Save and Continue" />
      </Link>
      {/* {error} */}
    </div>
  );
}

export default Donations;
