import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Trash2,
} from 'lucide-react';
import styles from './Donations.module.css';

function Donations() {
  const [donor, setDonor] = useState({});
  const [donations, setDonations] = useState([]);
  const [donorError, setDonorError] = useState('');
  const donorFields = ['Name', 'Phone', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Zip Code'];
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setDonor(location.state.donor);
      setDonations(location.state.donations);
    } else {
      console.log('No donor/donations field');
    }
  }, []);

  const donorUpdate = (e) => {
    e.preventDefault();
    const tempDonor = {};
    tempDonor.Name = document.getElementById('name').value;
    tempDonor.Phone = document.getElementById('phone').value;
    tempDonor.Email = document.getElementById('email').value;
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
      setDonorError(<p>Bad Zip Code</p>);
      return;
    }
    tempDonor['Zip Code'] = zipcode;
    setDonor(tempDonor);
    setDonorError('');
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
      <h1>Log a Donation</h1>
      <h2>Step 1. Add donor info</h2>
      <table className={styles.logTable}>
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
      <form onSubmit={donorUpdate}>
        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="name">
              Donor/organization name:
              {' '}
            </label>
          </div>
          <input required type="text" id="name" name="name" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="phone">
              Phone #:
              {' '}
            </label>
          </div>
          <input required type="text" id="phone" name="phone" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="email">
              Email address:
              {' '}
            </label>
          </div>
          <input required type="text" id="email" name="email" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="addressline1">
              Address line 1:
              {' '}
            </label>
          </div>
          <input required type="text" id="addressline1" name="addressline1" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="addressline2">
              Address line 2 (optional):
              {' '}
            </label>
          </div>
          <input type="text" id="addressline2" name="addressline2" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="city">
              City:
              {' '}
            </label>
          </div>
          <input required type="text" id="city" name="city" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="state">
              State:
              {' '}
            </label>
          </div>
          <input required type="text" id="state" name="state" />
        </div>

        <div className="flex-container">
          <div className="flex-child label">
            <label htmlFor="zipcode">
              Zip code:
              {' '}
            </label>
          </div>
          <input required type="text" id="zipcode" name="zipcode" />
        </div>
        <input type="submit" id="save" name="save" value="Save" />
      </form>
      {donorError}
      <h2>Step 2. Add donation info</h2>
      <table className={styles.logTable}>
        <thead>
          <tr>
            {donationFields.map((field) => (
              <th>{field}</th>
            ))}
            <th> Delete </th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <tr>
              {donationFields.map((field) => (
                <td>{donation[field]}</td>
              ))}
              <td className={styles.deleteButtonEntry}><button aria-label="Delete" type="button" onClick={(e) => deleteDonation(e, index)}><Trash2 /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={addDonation}>
        <div className={styles.donationForm}>
          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="quantity">
                Quantity:
                {' '}
              </label>
            </div>
            <input required type="number" id="quantity" name="quantity" />
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="gender">
                Gender:
                {' '}
              </label>
            </div>
            {/* <input required type="text" id="gender" name="gender" /> */}
            <select name="gender" id="gender">
              <option value="none" selected disabled hidden>Select an Option</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
            </select>
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="category">
                Category:
                {' '}
              </label>
            </div>
            {/* <input required type="text" id="category" name="category" /> */}
            <select name="category" id="category">
              <option value="none" selected disabled hidden>Select an Option</option>
              <option value="Infant/Child">Infant/Child</option>
              <option value="Youth">Youth</option>
              <option value="Adult">Adult</option>
            </select>
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="size">
                Size:
                {' '}
              </label>
            </div>
            <input required type="text" id="size" name="size" />
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="wide">
                Wide:
                {' '}
              </label>
            </div>
            <input type="checkbox" id="wide" name="wide" />
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="notes">
                Notes:
                {' '}
              </label>
            </div>
            <textarea required type="text" id="notes" name="notes" />
          </div>
        </div>
        <input type="submit" id="add" name="add" value="Add" />
      </form>
      <Link to="/confirmdonation" state={{ valid: true, donor, donations }}>
        <input type="submit" id="submit" name="submit" value="Save and Continue" />
      </Link>
    </div>
  );
}

export default Donations;
