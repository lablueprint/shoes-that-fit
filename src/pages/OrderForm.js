import React, { useState } from 'react';
import print from 'print-js';
// import reactDom from 'react-dom';
import './OrderForm.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(
  airtableConfig.baseKey,
);

function OrderForm() {
  const [curcards, setcurCards] = useState([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [wideWidth, setwideWidth] = useState('');
  const [size, setSize] = useState('');
  const [age, setAge] = useState('');
  const [school, setSchool] = useState('');
  const [submit, setSubmit] = useState(false);

  const [schoolName, setschoolName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const shoeUpdate = (evt) => {
    evt.preventDefault();
    const card = {};
    card.name = name;
    card.gender = gender;
    if (
      wideWidth === 'y'
      || wideWidth === 'Y'
      || wideWidth === 'yes'
      || wideWidth === 'YES'
    ) {
      card.wideWidth = true;
    } else {
      card.wideWidth = false;
    }

    card.size = size;
    card.age = age;
    card.school = school;
    console.log(card);
    setcurCards((prev) => [...prev, card]);
    setSubmit(false);
  };

  function submitOrder() {
    setName('');
    setGender('');
    setwideWidth('');
    setSize('');
    setAge('');
    setSchool('');
    setSubmit(true);
  }

  function pushToAirtable() {
    console.log({
      School: schoolName,
      Address1: address,
      City: city,
      State: state,
      'Zip Code': zip,
      'Contact Name': contact,
      'Email Address': email,
      Phone: phone,
      Date: date,
      Orders: JSON.stringify(curcards),
    });
    base('Orders').create(
      [
        {
          fields: {
            School: schoolName,
            Address1: address,
            City: city,
            State: state,
            'Zip Code': zip,
            'Contact Name': contact,
            'Email Address': email,
            Phone: phone,
            Date: date,
            Orders: JSON.stringify(curcards),
          },
        },
      ],
      (err, records) => {
        if (err) {
          console.error(err);
          setError(<p>{err.message}</p>);
          console.error(error);
          return;
        }
        records.forEach((record) => {
          console.log(record.getId());
        });
      },
    );
    setcurCards([]);
  }

  const errorStyle = {
    color: 'red',
  };

  function printForm() {
    print({
      printable: 'orders',
      type: 'html',
      ignoreElements: ['print', 'bigSubmit'],
      css: './OrderForm.css',
      targetStyles: ['*'],
    });
  }

  return (
    <div className="row">
      <script src="print.js" />
      <div className="column left">
        {submit ? (
          <div className="left-column">
            <form>
              <label htmlFor="name">School Name:</label>
              <div />
              <input
                className="full"
                required
                type="text"
                id="schoolName"
                name="schoolName"
                value={schoolName}
                onChange={(e) => setschoolName(e.target.value)}
              />
              <div className="space" />

              <div className="flex-container">
                <div className="flex-child label">
                  <label htmlFor="age">Address 1: </label>
                  <div />
                  <input
                    className="full"
                    required
                    type="text"
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="flex-child label">
                  <label htmlFor="gender">City </label>
                  <div />
                  <input
                    className="half"
                    required
                    type="text"
                    id="city"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="space" />

              <div className="flex-container">
                <div className="flex-child label">
                  <label htmlFor="size">State </label>
                  <div />
                  <input
                    className="half"
                    required
                    type="text"
                    id="state"
                    name="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="flex-child label">
                  <label htmlFor="wideWidth">Zip Code </label>
                  <div />
                  <input
                    className="half"
                    required
                    type="text"
                    id="zip"
                    name="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
              <div className="space" />

              <label htmlFor="school">Contact Name </label>
              <input
                className="full"
                required
                type="text"
                id="contact"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <div className="space" />

              <label htmlFor="school">Email Address </label>
              <input
                className="full"
                required
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="space" />

              <label htmlFor="school">Phone </label>
              <input
                className="half"
                required
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="space" />

              <label htmlFor="school">Date </label>
              <input
                className="half"
                required
                type="text"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <div className="space" />
            </form>
            <div style={errorStyle}>{error}</div>
          </div>
        ) : (
          <div className="left-column">
            <form onSubmit={shoeUpdate}>
              <label htmlFor="name">
                Student&apos;s First Name & Last Initial:
              </label>
              <div />
              <input
                className="full"
                required
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="space" />

              <div className="flex-container">
                <div className="flex-child label">
                  <label htmlFor="age">Age: </label>
                  <div />
                  <input
                    className="half"
                    required
                    type="number"
                    id="age"
                    name="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="flex-child label">
                  <label htmlFor="gender">Gender: </label>
                  <div />
                  <input
                    className="half"
                    required
                    type="text"
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>
              </div>
              <div className="space" />

              <div className="flex-container">
                <div className="flex-child label">
                  <label htmlFor="size">Size: </label>
                  <div />
                  <input
                    className="half"
                    required
                    type="number"
                    id="size"
                    name="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  />
                </div>
                <div className="flex-child label">
                  <label htmlFor="wideWidth">Wide Width?: </label>
                  <div />
                  <input
                    className="half"
                    required
                    type="boolean"
                    id="wideWidth"
                    name="wideWidth"
                    value={wideWidth}
                    onChange={(e) => setwideWidth(e.target.value)}
                  />
                </div>
              </div>
              <div className="space" />

              <label htmlFor="school">Teacher / School (if applicable) </label>
              <input
                className="full"
                required
                type="string"
                id="school"
                name="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
              <div className="space" />
              <input
                type="submit"
                id="submit"
                name="submit"
                value="Add Request"
              />
            </form>
            <div style={errorStyle}>{error}</div>
          </div>
        )}
      </div>
      <div className="column right">
        <div className="right-column">
          <div id="orders">
            <table>
              <thead>
                <tr>
                  <th width="263px">Student&apos;s First Name and Last Name</th>
                  <th width="100px">Age</th>
                  <th width="60px">Gender</th>
                  <th width="100px">Shoe Size</th>
                  <th width="70px">Wide Width?</th>
                  <th width="263px">Teacher or school?</th>
                </tr>
              </thead>
              <tbody>
                {console.log(curcards)}
                {curcards.length > 0
                  && curcards.map((card, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <tr key={index}>
                      <td>{card.name}</td>
                      <td>{card.age}</td>
                      <td>{card.gender}</td>
                      <td>{card.size}</td>
                      <td>{card.wide}</td>
                      <td>{card.school}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {submit ? (
              <div className="bottom">
                <div className="notes">
                  <label htmlFor="note">Notes:</label>
                  <div />
                  <input
                    className="full"
                    required
                    type="text"
                    id="note"
                    name="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="space" />
                </div>

                <div className="michael">
                  <button
                    type="button"
                    id="print"
                    name="confirm"
                    onClick={pushToAirtable}
                  >
                    Confirm Submission
                  </button>
                </div>
              </div>
            ) : (
              <div className="michael">
                <button
                  type="button"
                  id="print"
                  name="print"
                  onClick={printForm}
                >
                  Print Form
                </button>
                <button
                  type="submit"
                  id="bigSubmit"
                  name="bigsubmit"
                  onClick={submitOrder}
                >
                  {' '}
                  Submit Form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default OrderForm;
