import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

export default function DonationConfirmation() {
  const location = useLocation();
  const { valid, donor, donations } = location.state;
  const [error, setError] = useState('');
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];

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
  useEffect(() => {
    console.log(valid);
    console.log(donor);
    console.log(donations);
  }, []);

  return (
    <div>
      <table>
        <tr>
          <td>
            {donor.name}
          </td>
          <td>
            {donor.phone}
          </td>
          <td>
            {donor.email}
          </td>
          <td>
            {donor.addressline1}
          </td>
          <td>
            {donor.addressline2}
          </td>
          <td>
            {donor.city}
          </td>
          <td>
            {donor.state}
          </td>
          <td>
            {donor.zipcode}
          </td>
        </tr>
      </table>
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
      <form onSubmit={submitDonations}>
        <input type="submit" id="submit" name="submit" value="Submit Donations" />
      </form>
      <Link to="/donations" state={{ valid: true, donor, donations }}>
        <input type="submit" id="submit" name="submit" value="Back" />
      </Link>
      {error}
    </div>
  );
}
