import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { Info } from 'lucide-react';
import { Table } from '../components';
import styles from './Donations.module.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey, endpointURL: 'http://localhost:3000' })
  .base(airtableConfig.baseKey);

function Donations() {
  const [donations, setDonations] = useState([]);
  const [tableEntries, setTableEntries] = useState([]);
  const tableFields = ['Date', 'Logged By', 'Quantity', 'Donor', 'Preview'];

  const getDonations = () => {
    base('Donors').select({ view: 'Grid view' })
      .all()
      .then((records) => {
        setDonations(records);
      }, (err) => {
        if (err) {
          console.error(err);
        }
      });
    console.log(donations);
  };

  useEffect(() => {
    getDonations();
    setTableEntries(donations.map((donation) => {
      const tableEntry = {};
      const createDate = donation.fields.Created;
      tableEntry.Date = `${createDate.substring(5, 7)}/${createDate.substring(8, 10)}/${createDate.substring(0, 4)}`;
      tableEntry['Logged By'] = donation.fields['Logged By'];
      tableEntry.Quantity = donation.fields['Total Quantity'];
      tableEntry.Donor = donation.fields.Name;
      const shoeList = JSON.parse(donation.fields.Donations);
      let sizes = '';
      let numSizes = 0;
      shoeList.forEach((shoeEntry) => {
        if (numSizes < 5) {
          const gender = shoeEntry.Gender;
          const size = shoeEntry.Size;
          const wide = shoeEntry.Wide === 'W' ? 'W' : '';
          sizes += (String(gender).substring(0, 1) + String(size) + String(wide));
          numSizes += 1;
          if (!(numSizes === 5 || numSizes === shoeList.length)) {
            sizes += ', ';
          }
        }
      });
      tableEntry.Preview = sizes;
      return tableEntry;
    }));
    console.log(tableEntries);
  }, []);

  return (
    <div>
      <div>
        <h1 className={styles.header1}>Donations</h1>
        <Link className={styles.logLink} to="/logdonations">
          <input className={styles.logButton} type="submit" id="submit" name="submit" value="Create Donation" />
        </Link>
      </div>
      <div>
        <Table headers={tableFields} data={tableEntries} checkbox dataKeyProp="ID" />
      </div>
    </div>
  );
}

export default Donations;
