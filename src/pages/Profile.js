import React
// , { useState }
  from 'react';
import styles from './Profile.module.css';

// Airtable stuff
const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(airtableConfig.baseKey);
const username = 'jiaminxu1019@g.ucla.edu';
const dummyProfile = {
  Username: 'jiaminxu1019@g.ucla.edu',
  Role: 'Educator',
  Phone: '(626) 314-4856',
  ContactName: 'Jiamin Xu',
  SchoolName: 'UCLA',
  Address: '1805 Meridian Avenue',
  City: 'South Pasadena',
  State: 'CA',
  ZipCode: '91030',
};

function Profile() {
//   const [userInfo, setUserInfo] = useState();
//   setUserInfo(1);
//   console.log(userInfo);

  const filter = `{Username} = '${username}'`;
  base('Profile').select({ filterByFormula: filter }).eachPage(
    (records) => {
      console.log(records);
    },
  );

  return (
    <div className={styles.main}>
      <div className={styles['personal-information']}>
        <h2>Personal Information</h2>
        <div>
          <p>Name</p>
          <p>{dummyProfile.ContactName}</p>
        </div>
        <div>
          <p>Role</p>
          <p>{dummyProfile.Role}</p>
        </div>
        <div>
          <p>Email Address</p>
          <p>{dummyProfile.Username}</p>
        </div>
        <div>
          <p>Phone Number</p>
          <p>{dummyProfile.Phone}</p>
        </div>
      </div>

      <div className={styles['school-information']}>
        <h2>School Information</h2>
        <div>
          <p>School</p>
          <p>{dummyProfile.SchoolName}</p>
        </div>
        <div>
          <p>Address</p>
          <p>{dummyProfile.Address}</p>
        </div>
        <div>
          <p>City</p>
          <p>{dummyProfile.City}</p>
        </div>
        <div>
          <p>State</p>
          <p>{dummyProfile.State}</p>
        </div>
        <div>
          <p>Zip Code</p>
          <p>{dummyProfile.ZipCode}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
