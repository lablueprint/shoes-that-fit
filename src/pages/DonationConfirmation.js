import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Table } from '../components';

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
  const donorFields = ['Name', 'Phone', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Zip Code'];
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];
  // eslint-disable-next-line max-len
  const sum = donations.reduce((accumulator, object) => accumulator + parseInt(object.Quantity, 10), 0);
  const date = new Date();
  const submitDonations = (e) => {
    e.preventDefault();
    if (!donor) {
      console.log('Need a donor');
      return;
    }
    base('Donors').create([
      {
        fields: {
          Name: donor.Name,
          Phone: donor.Phone,
          Email: donor.Email,
          'Address Line 1': donor['Address Line 1'],
          'Address Line 2': donor['Address Line e'],
          City: donor.City,
          State: donor.State,
          'Zip Code': donor['Zip Code'],
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
      {/* eslint-disable-next-line max-len */}
      {/* <Table headers={donorFields} data={[donor]} checkbox={false} dataKeyProp="ID" /> */}
      <table>
        <thead>
          <tr>
            {donorFields.map((field) => (
              <th>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {donorFields.map((field) => (
              <td>{donor[field]}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <Table headers={donationFields} data={donations} checkbox={false} dataKeyProp="ID" />
      <div>
        <p>
          Total Quantity Donated:
          {' '}
          {sum}
        </p>
        <p>
          Date Logged:
          {' '}
          {date.getMonth() + 1}
          /
          {date.getDate()}
          /
          {date.getFullYear()}
        </p>
      </div>
      <Link to="/admindashboard">
        <button type="button" id="submit" name="submit" onClick={submitDonations}>Submit Donations</button>
        {/* <form onSubmit={submitDonations}>
          <input type="submit" id="submit" name="submit" value="Submit Donations" />
        </form> */}
      </Link>
      <Link to="/donations" state={{ valid: true, donor, donations }}>
        <input type="submit" id="submit" name="submit" value="Back" />
      </Link>
      {error}
    </div>
  );
}
