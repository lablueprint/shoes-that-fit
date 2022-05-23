import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Table } from '../components';
import styles from './DonationDetails.module.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function DonationDetails() {
  const location = useLocation();
  const { donor, recordID } = location.state;
  const donations = JSON.parse(donor.Donations);
  const [showDelete, setShowDelete] = useState(false);
  // const [error, setError] = useState('');
  const donorFields = ['Name', 'Phone', 'Email', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Zip Code'];
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];

  useEffect(() => {
    if (!donor) {
      console.error('Need a donor');
    }
  }, []);

  const deleteDonation = () => {
    base('Donors').destroy([recordID], (err, deletedRecords) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Deleted record', recordID);
      console.log(deletedRecords);
    });
  };

  return (
    <div>
      <h1 className={styles.header1}>
        <Link className={styles.cancelLink} to="/donations"><ChevronLeft color="black" size="30" /></Link>
        Donation:
        {' '}
        {`${String(Number(donor.Created.substring(5, 7)))}/${String(Number(donor.Created.substring(8, 10)))}/${donor.Created.substring(0, 4)}`}
      </h1>
      {/* eslint-disable-next-line max-len */}
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
            <b>Total Quantity Donated:</b>
            {' '}
            {donor['Total Quantity']}
            {' '}
            shoes
          </div>
          <div>
            <b>Logged By:</b>
            {' '}
            {donor['Logged By']}
          </div>
          {showDelete
            ? (
              <div className={styles.confirmMessage}>
                <p><b>Are you sure?</b></p>
                <div className={styles.deleteConfirm}>
                  <Link className={styles.backLink} to="/donations">
                    <input className={styles.deleteConfirmButton} type="submit" id="submit" name="submit" value="Yes" onClick={() => deleteDonation()} />
                  </Link>
                  <input className={styles.deleteDenyButton} type="submit" id="submit" name="submit" value="No" onClick={() => setShowDelete(false)} />
                </div>
              </div>
            )
            : <input className={styles.deleteButton} type="submit" id="submit" name="submit" value="Delete Donation" onClick={() => setShowDelete(true)} />}
        </div>
      </div>
      <Link className={styles.backLink} to="/donations">
        <input className={styles.backButton} type="submit" id="submit" name="submit" value="Back" />
      </Link>
      {/* {error ? (
        <div className={styles.error}>
          {error}
        </div>
      ) : null} */}
    </div>
  );
}

export default DonationDetails;
