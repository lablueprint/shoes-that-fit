import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';
import printJS from 'print-js';
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
  const navigate = useNavigate();

  const getDonations = () => {
    base('Donors').select({ view: 'Grid view' })
      .all()
      .then((records) => {
        setDonations(records);
      });
  };

  useEffect(getDonations, []);
  useEffect(() => {
    setTableEntries(donations.map((donation) => {
      const tableEntry = {};
      const createDate = donation.fields.Created;
      tableEntry.Date = `${String(Number(createDate.substring(5, 7)))}/${String(Number(createDate.substring(8, 10)))}/${createDate.substring(0, 4)}`;
      tableEntry['Logged By'] = donation.fields['Logged By'];
      tableEntry.Quantity = Number(donation.fields['Total Quantity']);
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
      tableEntry.recordID = donation.id;
      return tableEntry;
    }));
  }, [donations]);

  const printDonations = (e) => {
    e.preventDefault();
    printJS({
      printable: tableEntries,
      properties: tableFields,
      type: 'json',
    });
  };

  const redirectDonationDetails = (e, d) => {
    e.preventDefault();
    base('Donors').find(d.recordID, (err, record) => {
      if (err) { console.error(err); return; }
      console.log(record);
      console.log('Retrieved', record.id);
      // navigate('/');
      navigate('/donationdetails', { state: { donor: record.fields.Name, recordID: record.id } });
    });
  };

  return (
    <div>
      <div>
        <h1 className={styles.header1}>Donations</h1>
        <div className={styles.headers}>
          <Link className={styles.logLink} to="/logdonations">
            <input className={styles.logButton} type="submit" id="submit" name="submit" value="Log a new donation" />
          </Link>
          <Printer className={styles.print} onClick={printDonations} />
        </div>
      </div>
      <div>
        {tableEntries.length > 0
          ? <Table headers={tableFields} data={tableEntries} checkbox={false} dataKeyProp="ID" details selectCard={redirectDonationDetails} />
          : <div className={styles.error}>No donations found</div>}
      </div>
    </div>
  );
}

export default Donations;
