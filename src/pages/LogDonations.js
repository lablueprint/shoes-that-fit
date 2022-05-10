import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Trash2, Pencil,
} from 'lucide-react';
import styles from './LogDonations.module.css';

function LogDonations() {
  const [donor, setDonor] = useState({});
  const [donations, setDonations] = useState([]);
  const [donorError, setDonorError] = useState('');
  const [editingDonor, setEditingDonor] = useState(true);
  const donorFields = ['Name', 'Email', 'Phone', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Zip Code'];
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];
  const location = useLocation();
  const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validateEmail = (email) => String(email)
    .toLowerCase()
    .match(
      EMAIL_REGEX,
    );

  useEffect(() => {
    if (location.state) {
      setDonor(location.state.donor);
      setDonations(location.state.donations);
      setEditingDonor(false);
    } else {
      console.log('No donor/donations field');
    }
  }, []);

  const donorUpdate = (e) => {
    e.preventDefault();
    console.log(editingDonor);
    if (editingDonor) {
      const tempDonor = {};
      tempDonor.Name = document.getElementById('name').value;
      tempDonor.Phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      if (!validateEmail(email)) {
        setDonorError(<p className={styles.error}>Bad Email!</p>);
        return;
      }
      tempDonor.Email = email;
      tempDonor['Address Line 1'] = document.getElementById('addressline1').value;
      const addressline2Element = document.getElementById('addressline2');
      if (addressline2Element) {
        tempDonor['Address Line 2'] = addressline2Element.value;
      } else {
        tempDonor['Address Line 2'] = '';
      }
      tempDonor.City = document.getElementById('city').value;
      tempDonor.State = document.getElementById('state').value;
      const zipcode = parseInt(document.getElementById('zipcode').value, 10);
      if (!zipcode || zipcode < 10000 || zipcode > 99999) {
        setDonorError(<p className={styles.error}>Bad Zip Code!</p>);
        return;
      }
      tempDonor['Zip Code'] = zipcode;
      setDonor(tempDonor);
      setDonorError('');
    }
    setEditingDonor(!editingDonor);
  };

  const addDonation = (e) => {
    e.preventDefault();
    const donation = {};
    donation.Quantity = document.getElementById('quantity').value;
    donation.Gender = document.getElementById('gender').value;
    if (donation.Gender === 'none') {
      console.log('Select a gender');
      return;
    }
    donation.Category = document.getElementById('category').value;
    if (donation.Category === 'none') {
      console.log('Select a category');
      return;
    }
    donation.Size = document.getElementById('size').value;
    if (document.getElementById('wide').checked) {
      donation.Wide = 'W';
    } else {
      donation.Wide = '';
    }
    donation.Notes = document.getElementById('notes').value;
    setDonations([...donations, donation]);
  };
  const deleteDonation = (e, index) => {
    e.preventDefault();
    console.log(index);
    setDonations(donations.splice(0, index).concat(donations.splice(1)));
  };

  return (
    <div>
      <h1 className={styles.header1}>Log a Donation</h1>
      <h2 className={styles.header2}>Step 1. Add donor info</h2>
      {!editingDonor ? (
        <table className={styles.logTable}>
          <tbody>
            <tr>
              {donorFields.map((field) => (
                <td>{donor[field]}</td>
              ))}
              <td className={styles.buttonEntry}><button aria-label="Delete" type="button" onClick={donorUpdate}><Pencil /></button></td>
            </tr>
          </tbody>
        </table>
      ) : (
        <form onSubmit={donorUpdate}>
          <div className={styles.donationForm}>
            <div>
              <div className={styles.donationFormField}>
                <div>
                  <label htmlFor="name">
                    Donor/organization name
                    {' '}
                  </label>
                </div>
                <input required className={styles.name} type="text" id="name" name="name" defaultValue={donor.Name} />
              </div>

              <div className={styles.donationFormField}>
                <div>
                  <label htmlFor="phone">
                    Phone #
                    {' '}
                  </label>
                </div>
                <input required className={styles.phone} type="text" id="phone" name="phone" defaultValue={donor.Phone} />
              </div>

              <div className={styles.donationFormField}>
                <div>
                  <label htmlFor="email">
                    Email address
                    {' '}
                  </label>
                </div>
                <input required className={styles.email} type="text" id="email" name="email" defaultValue={donor.Email} />
              </div>
            </div>
            <div>
              <div className={styles.donationFormField}>
                <div>
                  <label htmlFor="addressline1">
                    Address line 1
                    {' '}
                  </label>
                </div>
                <input required className={styles.addressline1} type="text" id="addressline1" name="addressline1" defaultValue={donor['Address Line 1']} />
              </div>

              <div className={styles.donationFormField}>
                <div>
                  <label htmlFor="addressline2">
                    Address line 2 (optional)
                    {' '}
                  </label>
                </div>
                <input className={styles.addressline2} type="text" id="addressline2" name="addressline2" defaultValue={donor['Address Line 2']} />
              </div>

              <div className={styles.donationFormField}>
                <div>
                  <label htmlFor="city">
                    City
                    {' '}
                  </label>
                </div>
                <input required className={styles.city} type="text" id="city" name="city" defaultValue={donor.City} />
              </div>

              <div className={styles.donationFormField}>
                <div>
                  <label htmlFor="state">
                    State
                    {' '}
                  </label>
                </div>
                <input required className={styles.state} type="text" id="state" name="state" defaultValue={donor.State} />
              </div>

              <div className={styles.donationFormField}>
                <div>
                  <label htmlFor="zipcode">
                    Zip code
                    {' '}
                  </label>
                </div>
                <input required className={styles.zipcode} type="text" id="zipcode" name="zipcode" defaultValue={donor['Zip Code']} />
              </div>
              <input className={styles.addSaveButton} type="submit" id="save" name="save" value="Save" />
            </div>
          </div>
        </form>
      )}
      {donorError}
      <h2 className={styles.header2}>Step 2. Add donation info</h2>
      {donations.length > 0
        ? (
          <table className={styles.logTable}>
            <tbody>
              {donations.map((donation, index) => (
                <tr>
                  {donationFields.map((field) => (
                    <td>{donation[field]}</td>
                  ))}
                  <td className={styles.buttonEntry}><button aria-label="Delete" type="button" onClick={(e) => deleteDonation(e, index)}><Trash2 /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      <form onSubmit={addDonation}>
        <div className={styles.donationForm}>
          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="quantity">
                Quantity
                {' '}
              </label>
            </div>
            <input required className={styles.quantity} type="number" id="quantity" name="quantity" />
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="gender">
                Gender
                {' '}
              </label>
            </div>
            <select className={styles.gender} name="gender" id="gender">
              <option value="none" selected disabled hidden>Select an Option</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
            </select>
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="category">
                Category
                {' '}
              </label>
            </div>
            <select className={styles.category} name="category" id="category">
              <option value="none" selected disabled hidden>Select an Option</option>
              <option value="Infant/Child">Infant/Child</option>
              <option value="Youth">Youth</option>
              <option value="Adult">Adult</option>
            </select>
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="size">
                Size
                {' '}
              </label>
            </div>
            <input required className={styles.size} type="text" id="size" name="size" />
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="wide">
                Wide
                {' '}
              </label>
            </div>
            <input className={styles.wide} type="checkbox" id="wide" name="wide" />
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="notes">
                Notes
                {' '}
              </label>
            </div>
            <input required className={styles.notes} type="text" id="notes" name="notes" />
          </div>
          <input className={styles.addSaveButton} type="submit" id="add" name="add" value="Add" />
        </div>
      </form>
      <Link className={styles.cancelLink} to="/">
        <input className={styles.cancelButton} type="submit" id="submit" name="submit" value="Cancel" />
      </Link>
      <Link to="/confirmdonation" state={{ donor, donations }}>
        <input className={styles.confirmButton} type="submit" id="submit" name="submit" value="Save and Continue" />
      </Link>
    </div>
  );
}

export default LogDonations;
