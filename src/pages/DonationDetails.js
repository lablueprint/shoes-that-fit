import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Table } from '../components';
import styles from './DonationDetails.module.css';

// const Airtable = require('airtable');

// const airtableConfig = {
//   apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
//   baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
// };

// const base = new Airtable({ apiKey: airtableConfig.apiKey })
//   .base(airtableConfig.baseKey);

function DonationDetails() {
  const location = useLocation();
  console.log(location);
  const { donor } = location.state;
  const donations = JSON.parse(donor.Donations);
  // const [error, setError] = useState('');
  const donorFields = ['Name', 'Phone', 'Email', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Zip Code'];
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];

  useEffect(() => {
    if (!donor) {
      console.error('Need a donor');
    }
  }, []);

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
