import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Trash2, Pencil, ChevronLeft,
} from 'lucide-react';
import styles from './LogDonations.module.css';

function LogDonations() {
  const [donor, setDonor] = useState({});
  const [donations, setDonations] = useState([]);
  const [donorError, setDonorError] = useState('');
  const [donationError, setDonationError] = useState('');
  const [editingDonor, setEditingDonor] = useState(true);
  const donorFields = ['Name', 'Email', 'Phone', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Zip Code'];
  const donationFields = ['Quantity', 'Gender', 'Category', 'Wide', 'Size', 'Notes'];
  const location = useLocation();
  const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const PHONE_REGEX = /^\d{10}$/;
  const validateEmail = (email) => String(email)
    .toLowerCase()
    .match(
      EMAIL_REGEX,
    );
  const validatePhone = (phone) => String(phone)
    .toLowerCase()
    .match(
      PHONE_REGEX,
    );

  useEffect(() => {
    if (location.state) {
      setDonor(location.state.donor);
      setDonations(location.state.donations);
      setEditingDonor(false);
    }
  }, []);

  const donorUpdate = (e) => {
    e.preventDefault();
    if (editingDonor) {
      const tempDonor = {};
      tempDonor.Name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      if (!validatePhone(phone)) {
        setDonorError('Please provide a valid 10-digit phone number.');
        return;
      }
      tempDonor.Phone = phone;
      const email = document.getElementById('email').value;
      if (!validateEmail(email)) {
        setDonorError('Please provide a valid email address.');
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
        setDonorError('Please provide a valid zip code.');
        return;
      }
      tempDonor['Zip Code'] = zipcode;
      setDonor(tempDonor);
      setDonorError(null);
    }
    setEditingDonor(!editingDonor);
  };

  const addDonation = (e) => {
    e.preventDefault();
    const donation = {};
    donation.Quantity = document.getElementById('quantity').value;
    donation.Gender = document.getElementById('gender').value;
    if (donation.Gender === 'none') {
      setDonationError('Select a gender');
      return;
    }
    donation.Category = document.getElementById('category').value;
    if (donation.Category === 'none') {
      setDonationError('Select a category.');
      return;
    }
    const size = document.getElementById('size').value;
    if (!(!Number.isNaN(size) && (Number.isInteger(Number(size)) || (size.substring(size.length - 2, size.length) === '.5')))) {
      setDonationError('Please enter a valid shoe size.');
      return;
    }
    donation.Size = Number(size);
    if (document.getElementById('wide').checked) {
      donation.Wide = 'W';
    } else {
      donation.Wide = '';
    }
    donation.Notes = document.getElementById('notes').value;
    setDonationError('');
    setDonations([...donations, donation]);
  };

  const deleteDonation = (e, index) => {
    e.preventDefault();
    setDonations(donations.splice(0, index).concat(donations.splice(1)));
  };

  const checkState = (e) => {
    if (editingDonor) {
      e.preventDefault();
      setDonorError('Please save your donor information.');
    }
    if (donations.length === 0) {
      e.preventDefault();
      setDonationError('Please add at least one donation.');
    }
  };

  return (
    <div>
      <h1 className={styles.header1}>
        <Link className={styles.cancelLink} to="/donations"><ChevronLeft color="black" size="30" /></Link>
        Log a Donation
      </h1>
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
      {donorError ? (
        <div className={styles.error}>
          {donorError}
        </div>
      ) : null}
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
            <input required className={styles.quantity} type="number" id="quantity" name="quantity" min="1" />
          </div>

          <div className={styles.donationFormField}>
            <div>
              <label htmlFor="gender">
                Gender
                {' '}
              </label>
            </div>
            <select className={styles.gender} name="gender" id="gender">
              <option value="none" selected disabled hidden>(Select)</option>
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
              <option value="none" selected disabled hidden>(Select)</option>
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
      {donationError ? (
        <div className={styles.error}>
          {donationError}
        </div>
      ) : null}
      <Link className={styles.cancelLink} to="/donations">
        <input className={styles.cancelButton} type="submit" id="submit" name="submit" value="Cancel" />
      </Link>
      <Link to="/confirmdonation" state={{ donor, donations }}>
        <input className={styles.confirmButton} type="submit" id="submit" name="submit" value="Save and Continue" onClick={checkState} />
      </Link>
    </div>
  );
}

export default LogDonations;
