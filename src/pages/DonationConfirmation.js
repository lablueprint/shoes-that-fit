import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import { Table } from '../components';
import styles from './DonationConfirmation.module.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function DonationConfirmation({ username }) {
  console.log(username);
  const location = useLocation();
  const { donor, donations } = location.state;
  const [error, setError] = useState('');
  const donorFields = ['Name', 'Phone', 'Email', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Zip Code'];
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];
  // eslint-disable-next-line max-len
  const sum = donations.reduce((accumulator, object) => accumulator + parseInt(object.Quantity, 10), 0);
  const date = new Date();
  const submitDonations = (e) => {
    if (!donor) {
      e.preventDefault();
      console.error('Need a donor');
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
          'Logged By': username,
          'Total Quantity': sum,
        },
      },
    ], (err, records) => {
      if (err) {
        e.preventDefault();
        console.error(err);
        setError(err.message);
        return;
      }
      records.forEach((record) => {
        console.log(record.getId());
      });
    });
  };

  return (
    <div>
      <h1 className={styles.header1}>
        <Link className={styles.cancelLink} to="/donations"><ChevronLeft color="black" size="30" /></Link>
        Log a Donation
      </h1>
      {/* eslint-disable-next-line max-len */}
      <div className={styles.confirmMessage}>Please confirm you would like to log the following donations.</div>
      <Table headers={donationFields} data={donations} checkbox={false} dataKeyProp="ID" />
      <div className={styles.allInfo}>
        <div>
          <h2 className={styles.sectionHeader}>Donor Info</h2>
          <div className={styles.donorInfo}>
            <div className={styles.donorInfoEntries}>
              <div className={styles.topEntry}>
                {donor[donorFields[0]]}
              </div>
              <div>
                {donor[donorFields[1]]}
              </div>
              <div className={styles.bottomEntry}>
                {donor[donorFields[2]]}
              </div>
            </div>
            <div className={styles.donorInfoEntries}>
              <div className={styles.topEntry}>
                {donor[donorFields[3]]}
              </div>
              <div>
                {donor[donorFields[4]]}
              </div>
              <div className={styles.bottomEntry}>
                {donor[donorFields[5]]}
                {' '}
                {donor[donorFields[6]]}
                {', '}
                {donor[donorFields[7]]}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.donationInfo}>
          <h2 className={styles.sectionHeader}>Donation Summary</h2>
          <div>
            Total Quantity Donated:
            {' '}
            {sum}
            {' '}
            shoes
          </div>
          <div>
            Logged By:
            {' '}
            {username}
          </div>
          <div>
            Date Logged:
            {' '}
            {date.getMonth() + 1}
            /
            {date.getDate()}
            /
            {date.getFullYear()}
          </div>
        </div>
      </div>
      <Link className={styles.backLink} to="/logdonations" state={{ donor, donations }}>
        <input className={styles.backButton} type="submit" id="submit" name="submit" value="Back" />
      </Link>
      <Link to="/donations">
        <button className={styles.submitButton} type="button" id="submit" name="submit" onClick={submitDonations}>Submit Donations</button>
      </Link>
      {error ? (
        <div className={styles.error}>
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default DonationConfirmation;

DonationConfirmation.propTypes = {
  username: PropTypes.string.isRequired,
};
