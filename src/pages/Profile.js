import React
, { useEffect, useState }// , { useState }
  from 'react';
import PropTypes from 'prop-types';
import styles from './Profile.module.css';

function Profile({ username, base }) {
  const [profile, setProfile] = useState({});
  const filter = `{Username} = '${username}'`;

  useEffect(() => {
    base('Profile').select({ filterByFormula: filter }).eachPage(
      (records) => {
        const info = records[0].fields;
        setProfile({
          ContactName: info.ContactName,
          Role: info.Role,
          Username: info.Username,
          Phone: info.Phone,
          SchoolName: info.SchoolName,
          Address: info.Address,
          City: info.City,
          State: info.State,
          ZipCode: info.ZipCode,
        });
      },
    );
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles['personal-information']}>
        <div className={styles['top-bar']}>
          <h2>Personal Information</h2>
        </div>
        <div>
          <div className={styles.label}>Name</div>
          <div>{profile.ContactName}</div>
        </div>
        <div>
          <div className={styles.label}>Role</div>
          <div>{profile.Role}</div>
        </div>
        <div>
          <div className={styles.label}>Email Address</div>
          <div>{profile.Username}</div>
        </div>
        <div>
          <div className={styles.label}>Phone Number</div>
          <div>{profile.Phone}</div>
        </div>
      </div>

      <div className={styles['school-information']}>
        <div className={styles['top-bar']}>
          <h2>School Information</h2>
        </div>
        <div>
          <div className={styles.label}>School</div>
          <div>{profile.SchoolName}</div>
        </div>
        <div>
          <div className={styles.label}>Address</div>
          <div>{profile.Address}</div>
        </div>
        <div>
          <div className={styles.label}>City</div>
          <div>{profile.City}</div>
        </div>
        <div>
          <div className={styles.label}>State</div>
          <div>{profile.State}</div>
        </div>
        <div>
          <div className={styles.label}>Zip Code</div>
          <div>{profile.ZipCode}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

Profile.propTypes = {
  base: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};
