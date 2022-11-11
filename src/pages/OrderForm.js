import React, { useState } from 'react';
import print from 'print-js';
import PropTypes from 'prop-types';
// import reactDom from 'react-dom';
import { Navigate, Link } from 'react-router-dom';
// import Card from '../components/card';
import styles from './OrderForm.module.css';

function OrderForm({ isLoggedIn, base }) {
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
      || wideWidth === 'Yes'
    ) {
      card.wideWidth = true;
    } else {
      card.wideWidth = false;
    }

    card.size = size;
    card.age = age;
    card.school = school;
    card.note = note;
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
            Notes: note,
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
    setschoolName('');
    setAddress('');
    setCity('');
    setState('');
    setZip('');
    setContact('');
    setEmail('');
    setPhone('');
    setNote('');
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
    !isLoggedIn
      ? (<Navigate to="/" />)
      : (
        <div className={styles.orderFormContainer}>
          <div className={styles.row}>
            <script src="print.js" />
            <div className={[styles.column, styles.left].join(' ')}>
              {submit ? (
                <div className={styles.leftColumn}>
                  <form>
                    <label htmlFor="name">School Name:</label>
                    <div />
                    <input
                      className={styles.full}
                      required
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      value={schoolName}
                      onChange={(e) => setschoolName(e.target.value)}
                    />
                    <div className={styles.space} />

                    <div className={styles.flexContainer}>
                      <div className={styles.label}>
                        <label htmlFor="age">Address 1: </label>
                        <div />
                        <input
                          className={styles.full}
                          required
                          type="text"
                          id="address"
                          name="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                      <div className={[styles.flexChild, styles.label].join(' ')}>
                        <label htmlFor="gender">City </label>
                        <div />
                        <input
                          className={styles.half}
                          required
                          type="text"
                          id="city"
                          name="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.space} />

                    <div className={styles.flexContainer}>
                      <div className={[styles.flexChild, styles.label].join(' ')}>
                        <label htmlFor="size">State </label>
                        <div />
                        <input
                          className={styles.half}
                          required
                          type="text"
                          id="state"
                          name="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                      <div className={[styles.flexChild, styles.label].join(' ')}>
                        <label htmlFor="wideWidth">Zip Code </label>
                        <div />
                        <input
                          className={styles.half}
                          required
                          type="text"
                          id="zip"
                          name="zip"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.space} />

                    <label htmlFor="school">Contact Name </label>
                    <input
                      className={styles.full}
                      required
                      type="text"
                      id="contact"
                      name="contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                    <div className={styles.space} />

                    <label htmlFor="school">Email Address </label>
                    <input
                      className={styles.full}
                      required
                      type="text"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className={styles.space} />

                    <label htmlFor="school">Phone </label>
                    <input
                      className={styles.half}
                      required
                      type="text"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <div className={styles.space} />

                  </form>
                  <div style={errorStyle}>{error}</div>
                </div>
              ) : (
                <div className={styles.leftColumn}>
                  <form onSubmit={shoeUpdate}>
                    <label htmlFor="name">
                      Student&apos;s First Name & Last Initial:
                    </label>
                    <div />
                    <input
                      className={styles.full}
                      required
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div className={styles.space} />

                    <div className={styles.flexContainer}>
                      <div className={[styles.flexChild, styles.label]}>
                        <label htmlFor="age">Age: </label>
                        <div />
                        <input
                          className={styles.half}
                          required
                          type="number"
                          id="age"
                          name="age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div className={[styles.flexChild, styles.label]}>
                        <label htmlFor="gender">Gender: </label>
                        <div />
                        <input
                          className={styles.half}
                          required
                          type="text"
                          id="gender"
                          name="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.space} />

                    <div className={styles.flexContainer}>
                      <div className={[styles.flexChild, styles.label]}>
                        <label htmlFor="size">Size: </label>
                        <div />
                        <input
                          className={styles.half}
                          required
                          id="size"
                          name="size"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          list="sizes"
                        />
                        <datalist id="sizes">
                          <option value="Young Child 4"> </option>
                          <option value="Young Child 4.5"> </option>
                          <option value="Young Child 5"> </option>
                          <option value="Young Child 5.5"> </option>
                          <option value="Young Child 6"> </option>
                          <option value="Young Child 6.5"> </option>
                          <option value="Young Child 7"> </option>
                          <option value="Young Child 7.5"> </option>
                          <option value="Young Child 8"> </option>
                          <option value="Young Child 8.5"> </option>
                          <option value="Young Child 9"> </option>
                          <option value="Young Child 9.5"> </option>
                          <option value="Young Child 10"> </option>
                          <option value="Young Child 10.5"> </option>
                          <option value="Young Child 11"> </option>
                          <option value="Young Child 11.5"> </option>
                          <option value="Young Child 12"> </option>
                          <option value="Young Child 12.5"> </option>
                          <option value="Young Child 13"> </option>
                          <option value="Young Child 13.5"> </option>
                          <option value="Youth 1"> </option>
                          <option value="Youth 1.5"> </option>
                          <option value="Youth 2"> </option>
                          <option value="Youth 2.5"> </option>
                          <option value="Youth 3"> </option>
                          <option value="Youth 3.5"> </option>
                          <option value="Youth 4"> </option>
                          <option value="Youth 4.5"> </option>
                          <option value="Adult 5"> </option>
                          <option value="Adult 5.5"> </option>
                          <option value="Adult 6"> </option>
                          <option value="Adult 6.5"> </option>
                          <option value="Adult 7"> </option>
                          <option value="Adult 7.5"> </option>
                          <option value="Adult 8"> </option>
                          <option value="Adult 8.5"> </option>
                          <option value="Adult 9"> </option>
                          <option value="Adult 9.5"> </option>
                          <option value="Adult 10"> </option>
                          <option value="Adult 10.5"> </option>
                          <option value="Adult 11"> </option>
                          <option value="Adult 11.5"> </option>
                          <option value="Adult 12"> </option>
                          <option value="Adult 12.5"> </option>
                          <option value="Adult 13"> </option>
                          <option value="Adult 13.5"> </option>
                          <option value="Adult 14"> </option>
                          <option value="Adult 15"> </option>
                        </datalist>
                      </div>
                      <div className={[styles.flexChild, styles.label]}>
                        <label htmlFor="wideWidth">Wide Width?: </label>
                        <div />
                        <input
                          className={styles.half}
                          required
                          id="wideWidth"
                          name="wideWidth"
                          value={wideWidth}
                          onChange={(e) => setwideWidth(e.target.value)}
                          list="yesorno"
                        />
                        <datalist id="yesorno">
                          <option value="Yes"> </option>
                          <option value="No"> </option>
                        </datalist>
                      </div>
                    </div>
                    <div className={styles.space} />

                    <label htmlFor="school">Teacher / School (if applicable) </label>
                    <input
                      className={styles.full}
                      type="string"
                      id="school"
                      name="school"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    />
                    <div className={styles.space} />
                    <input
                      type="submit"
                      id="submit"
                      className={styles.submit}
                      name="submit"
                      value="Add Request"
                    />
                  </form>
                  <div style={errorStyle}>{error}</div>
                </div>
              )}
            </div>
            <div className={[styles.column, styles.right].join(' ')}>
              <div className={styles.rightColumn}>
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
                      {curcards.length > 0
                  && curcards.map((card, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <tr key={index}>
                      <td>{card.name}</td>
                      <td>{card.age}</td>
                      <td>{card.gender}</td>
                      <td>{card.size}</td>
                      <td>{card.wideWidth ? 'Yes' : 'No'}</td>
                      <td>{card.school}</td>
                    </tr>
                  ))}
                    </tbody>
                  </table>
                  {submit ? (
                    <div className={styles.bottom}>
                      <div className={styles.notes}>
                        <label htmlFor="note">Notes:</label>
                        <div />
                        <input
                          className={styles.full}
                          required
                          type="text"
                          id="note"
                          name="note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                        <div className={styles.space} />
                      </div>

                      <div className={styles.michael}>
                        <Link to="/orderhistory">
                          <button
                            type="submit"
                            id="print"
                            name="confirm"
                            className={styles.bigSubmit}
                            onClick={pushToAirtable}
                          >
                            Confirm Submission
                          </button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.michael}>
                      <button
                        type="button"
                        id="print"
                        name="print"
                        onClick={printForm}
                        className={styles.print}
                      >
                        Print Form
                      </button>
                      <button
                        type="submit"
                        id="bigSubmit"
                        name="bigsubmit"
                        onClick={submitOrder}
                        className={styles.bigSubmit}
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
        </div>
      )
  );
}

export default OrderForm;

OrderForm.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  base: PropTypes.func.isRequired,
};
