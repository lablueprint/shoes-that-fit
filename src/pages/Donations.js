import React, { useState } from 'react';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function Donations() {
  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState('');
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];
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
    donation.Category = document.getElementById('category').value;
    donation.Size = document.getElementById('size').value;
    if (document.getElementById('wide')) {
      donation.Wide = 'W';
    } else {
      donation.Wide = 'NW';
    }
    donation.Notes = document.getElementById('notes').value;
    setDonations([...donations, donation]);
  };
  const submitDonations = (e) => {
    e.preventDefault();
    if (!donor) {
      console.log('Need a donor');
      return;
    }
    base('Donors').create([
      {
        fields: {
          Name: donor.name,
          Phone: donor.phone,
          Email: donor.email,
          'Address Line 1': donor.addressline1,
          'Address Line 2': donor.addressline2,
          City: donor.city,
          State: donor.state,
          'Zip Code': donor.zipcode,
          Donations: JSON.stringify(donations),

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
        return;
      }
      records.forEach((record) => {
        console.log(record.getId());
      });
    });
  };

  return (
    <div>
      <h1>Log a Donation</h1>
      <h2>Step 1. Add donor info</h2>
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
          <input required type="text" id="gender" name="gender" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="category">
              Category:
              {' '}
            </label>
          </div>
          <input required type="text" id="category" name="category" />
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
            <label htmlFor="width">
              Wide:
              {' '}
            </label>
          </div>
          <input type="checkbox" id="width" name="addressline2" />
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
      <form onSubmit={submitDonations}>
        <input type="submit" id="submit" name="submit" value="Save and Continue" />
      </form>
      {error}
    </div>
  );
}

export default Donations;
