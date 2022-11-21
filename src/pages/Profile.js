import React
, { useEffect, useState }// , { useState }
  from 'react';
import PropTypes from 'prop-types';
import styles from './Profile.module.css';
import Popup from './Popup';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
const ZIPCODE_REGEX = /^[0-9]+$/;

function Profile({ username, base }) {
  const [profile, setProfile] = useState({});
  const filter = `{Username} = '${username}'`;
  const [editing1, setEditing1] = useState(false);
  const [editing2, setEditing2] = useState(false);

  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  // /* eslint-disable */
  const [id, setId] = useState('');

  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const closePopup = () => setPopup(false);

  async function updateData() {
    base('Profile').update([
      {
        id,
        fields: {
          Username: user,
          Role: profile.Role,
          Phone: phone,
          ContactName: name,
          SchoolName: school,
          Address: address,
          City: city,
          State: state,
          ZipCode: zipcode,
        },
      },
    ], (err, records) => {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach((record) => {
        console.log(record.get('Username'));
      });
    });

    // await base('Profile').destroy([id], (err, deletedRecords) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log('Deleted', deletedRecords.length, 'records');
    // });

    // base('Profile').create([
    //   {
    //     fields: {
    //       Username: user,
    //       Role: profile.Role,
    //       Phone: phone,
    //       ContactName: name,
    //       SchoolName: school,
    //       Address: address,
    //       City: city,
    //       State: state,
    //       ZipCode: zipcode,
    //     },
    //   },
    // ], (err, records) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   records.forEach((record) => {
    //     setId(record.getId());
    //   });
    // });
  }

  function resetPersonal() {
    setName(profile.ContactName);
    setUser(profile.Username);
    setPhone(profile.Phone);
  }

  function resetSchool() {
    setSchool(profile.SchoolName);
    setAddress(profile.Address);
    setCity(profile.City);
    setState(profile.State);
    setZipcode(profile.ZipCode);
  }

  function swapEdit1(evt, success) {
    evt.preventDefault();
    if (success) {
      if (!(PHONE_REGEX.test(phone))) {
        setPopupMessage('Invalid phone number!');
        setPopup(true);
        return;
      }
      if (!(EMAIL_REGEX.test(user))) {
        setPopupMessage('Invalid email address!');
        setPopup(true);
        return;
      }

      const nums = phone.replace(/\D/g, '');
      const newPhone = `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6, 10)}`;
      setPhone(newPhone);

      setProfile((prev) => ({
        ...prev, ContactName: name, Username: user, Phone: newPhone,
      }));

      updateData();
    }
    resetPersonal();
    setEditing1(!editing1);
  }

  function swapEdit2(evt, success) {
    evt.preventDefault();
    if (success) {
      if (!(ZIPCODE_REGEX.test(zipcode)) || zipcode.length !== 5) {
        setPopupMessage('Invalid zip code!');
        setPopup(true);
        return;
      }

      setProfile((prev) => ({
        ...prev, SchoolName: school, Address: address, City: city, State: state, ZipCode: zipcode,
      }));

      updateData();
    }
    resetSchool();
    setEditing2(!editing2);
  }

  useEffect(() => {
    base('Profile').select({ filterByFormula: filter }).eachPage(
      (records) => {
        if (records.size === 0) {
          setProfile({
            ContactName: '',
            Role: '',
            Username: '',
            Phone: '',
            SchoolName: '',
            Address: '',
            City: '',
            State: '',
            ZipCode: '',
          });
          return;
        }
        const info = records[0].fields;
        setId(records[0].id);
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

        setName(info.ContactName);
        setUser(info.Username);
        setPhone(info.Phone);
        setSchool(info.SchoolName);
        setAddress(info.Address);
        setCity(info.City);
        setState(info.State);
        setZipcode(info.ZipCode);
      },
    );
  }, []);

  return (
    <div className={styles.main}>

      {popup && (
      <Popup
        closePopup={closePopup}
        success={false}
        message={popupMessage}
      />
      )}

      {(!editing1) ? (
        <div className={styles['personal-information']}>
          <div className={styles['top-bar']}>
            <div>
              <h2>Personal Information</h2>
            </div>
            <div className={styles.buttons}>
              <form onSubmit={(evt) => { swapEdit1(evt, false); }}>
                <input className={styles['edit-btn']} type="submit" value="Edit" />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Name</div>
            <div className={styles.value}>{profile.ContactName}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Role</div>
            <div className={styles.value}>{profile.Role}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Email</div>
            <div className={styles.value}>{profile.Username}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Phone</div>
            <div className={styles.value}>{profile.Phone}</div>
          </div>
        </div>
      ) : (
        <div className={styles['personal-information']}>
          <div className={styles['top-bar']}>
            <div>
              <h2>Personal Information</h2>
            </div>
            <div className={styles.buttons}>
              <form onSubmit={(evt) => { swapEdit1(evt, false); }}>
                <input className={styles['cancel-btn']} type="submit" value="Cancel" />
              </form>
              <form onSubmit={(evt) => { swapEdit1(evt, true); }}>
                <input className={styles['edit-btn']} type="submit" value="Save" />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Name</div>
            <div className={styles.value}>
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <input className={styles['input-field']} type="text" maxLength={70} value={name} onChange={(e) => setName(e.target.value)} />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Role</div>
            <div className={styles.value}>{profile.Role}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Email</div>
            <div className={styles.value}>
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <input className={styles['input-field']} type="text" maxLength={345} value={user} onChange={(e) => setUser(e.target.value)} />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Phone</div>
            <div className={styles.value}>
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <input className={styles['input-field']} type="text" maxLength={25} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </form>
            </div>
          </div>
        </div>
      )}

      {(!editing2) ? (
        <div className={styles['school-information']}>
          <div className={styles['top-bar']}>
            <div>
              <h2>School Information</h2>
            </div>
            <div className={styles.buttons}>
              <form onSubmit={(evt) => { swapEdit2(evt, false); }}>
                <input className={styles['edit-btn']} type="submit" value="Edit" />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>School</div>
            <div className={styles.value}>{profile.SchoolName}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Address</div>
            <div className={styles.value}>{profile.Address}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>City</div>
            <div className={styles.value}>{profile.City}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>State</div>
            <div className={styles.value}>{profile.State}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Zip Code</div>
            <div className={styles.value}>{profile.ZipCode}</div>
          </div>
        </div>
      ) : (
        <div className={styles['school-information']}>
          <div className={styles['top-bar']}>
            <div>
              <h2>School Information</h2>
            </div>
            <div className={styles.buttons}>
              <form onSubmit={(evt) => { swapEdit2(evt, false); }}>
                <input className={styles['cancel-btn']} type="submit" value="Cancel" />
              </form>
              <form onSubmit={(evt) => { swapEdit2(evt, true); }}>
                <input className={styles['edit-btn']} type="submit" value="Save" />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>School</div>
            <div className={styles.value}>
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <input className={styles['input-field']} type="text" maxLength={80} value={school} onChange={(e) => setSchool(e.target.value)} />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Address</div>
            <div className={styles.value}>
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <input className={styles['input-field']} type="text" maxLength={110} value={address} onChange={(e) => setAddress(e.target.value)} />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>City</div>
            <div className={styles.value}>
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <input className={styles['input-field']} type="text" maxLength={85} value={city} onChange={(e) => setCity(e.target.value)} />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>State</div>
            <div className={styles.value}>
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <input className={styles['input-field']} type="text" maxLength={14} value={state} onChange={(e) => setState(e.target.value)} />
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Zip Code</div>
            <div className={styles.value}>
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <input className={styles['input-field']} type="text" maxLength={5} value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

Profile.propTypes = {
  base: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};
