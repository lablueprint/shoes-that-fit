import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from './login.module.css';

export default function LoginPage({ isLoggedIn, onLogin }) {
  console.log(isLoggedIn);
  const location = useLocation();
  const { role } = location.state;
  console.log(role);
  // console.log(check.role);

  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [role, setRole] = useState('Educator');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [string, setString] = useState('Log In');
  const [hasAccount, setHasAccount] = useState(true);
  const [contactName, setContactName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [regAdminStatus, setregAdminStatus] = useState('Password');
  // const [choseRole, setChoseRole] = useState(true);

  const handleSignUp = async (e) => {
    let curError = '';
    setError('');
    e.preventDefault();
    if (username.length === 0) {
      curError = 'Error: username cannot be empty.';
      setError(curError);
      return;
    }
    if (password.length === 0) {
      curError = 'Error: password cannot be empty.';
      setError(curError);
      return;
    }
    if (confirmPassword.length === 0) {
      curError = 'Error: must confirm password.';
      setError(curError);
      return;
    }
    if (confirmPassword !== password) {
      curError = 'Error: confirm password must match password.';
      setError(curError);
      return;
    }

    const json = JSON.stringify({ username, password });
    const token = process.env.REACT_APP_AIRTABLE_USER_KEY;

    await axios.post('http://localhost:8000/v0/appHz4HNC5OYabrnl/__airlock_register__', json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('YAY');
          const profile = {
            role,
            contactName,
            schoolName,
            address,
            city,
            state,
            zipCode,
            phone,
          };
          onLogin(username, password, profile, true, false);
          // go to home page and/or confirm email
          // set redux that user is logged in
        }
      })
      .catch((e2) => {
        console.log(e2);
        curError = 'Error: Incorrect password.';
        setError(curError);
        // incorrect username or password
      });
  };

  const handleSignIn = async (e) => {
    let curError = '';
    setError('');
    e.preventDefault();
    if (username.length === 0) {
      curError = 'Error: username cannot be empty.';
      setError(curError);
      return;
    }
    if (password.length === 0) {
      curError = 'Error: password cannot be empty.';
      setError(curError);
      return;
    }

    const json = JSON.stringify({ username, password });
    const token = process.env.REACT_APP_AIRTABLE_USER_KEY;

    await axios.post('http://localhost:8000/v0/appHz4HNC5OYabrnl/__airlock_login__', json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          const profile = {
            role,
            contactName,
            schoolName,
            address,
            city,
            state,
            zipCode,
            phone,
          };
          onLogin(username, password, profile, false, false);
          // go to home page and set login user in redux
        }
      })
      .catch((e2) => {
        console.log(e2);
        curError = 'Error: Incorrect password.';
        setError(curError);
        // incorrect username or password
      });
  };

  return (
    isLoggedIn
      ? (
        <Navigate to="/admindashboard" />
      )
      : (

        <div className={styles.col}>
          {console.log(regAdminStatus)}

          <h1 className={styles.top}>
            Please
            {` ${string}`}
          </h1>
          <form>
            {string === 'Log In' && (
              <div className={styles.col}>
                <label className={styles.leftcol}>
                  <p>Email Address</p>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label className={styles.leftcol}>
                  <p>Password </p>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
              </div>
            )}
            <div>
              {!hasAccount ? (
                <>
                  {string === 'Register' && (
                  <>
                    {regAdminStatus === 'Password' && (
                      <div className={styles.center}>
                        <div className={styles.col}>
                          <h3>
                            Contact Information
                          </h3>
                          <div className={styles.col}>
                            <p>Email </p>
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>

                          <div className={styles.col}>
                            <p>Password </p>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                          </div>

                          <div className={styles.col}>
                            <p>Confirm Password </p>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                          </div>

                          <div className={styles.space} />
                          <div className={styles.col}>
                            <button className={styles.blue} type="button" onClick={() => { setregAdminStatus('Login'); }}> Next</button>
                          </div>

                        </div>

                      </div>

                    )}
                    {regAdminStatus === 'Login' && (
                      <div>
                        <div className={styles.col}>
                          <p>Contact Name </p>
                          <input
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                          />
                        </div>

                        <div className={styles.col}>
                          <p>Phone </p>
                          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>

                        <div className={styles.space} />

                        <button className={styles.blue} type="button" onClick={handleSignUp}> Register</button>
                      </div>
                    )}
                    {/* <div>
                      <h3>
                        Contact Information
                      </h3>
                      <p>Email </p>
                      <input type="text" value={username}
                      onChange={(e) => setUsername(e.target.value)} />
                      <p>Contact Name </p>
                      <input type="text" value={contactName}
                      onChange={(e) => setContactName(e.target.value)} />
                      <p>Phone </p>
                      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div> */}
                    {role === 'Educator'
                    && (
                    <div>
                      <h3>
                        School Information
                      </h3>
                      <p>School Name </p>
                      <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                      <p>Address </p>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                      <p>City </p>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                      <p>State </p>
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
                      <p>Zip Code </p>
                      <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                    </div>
                    )}
                  </>
                  )}
                  <br />
                  <br />

                  {/* <button type="button" onClick={handleSignUp}> Register</button>
                  <br /> */}

                  <p>
                    {/* toggle the state when you click the button */}
                    <button
                      className={styles.red}
                      type="button"
                      onClick={() => {
                        setHasAccount(!hasAccount);
                        setString('Log In');
                      }}
                    >
                      Have an account? Sign In
                    </button>
                  </p>
                </>
              ) : (
                <div className={styles.login}>
                  {/* <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option> Educator</option>
                    <option> Administrator</option>
                  </select> */}
                  <div className={styles.space} />
                  <button
                    type="button"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </button>
                  <div className={styles.space} />
                  <button
                    type="button"
                    onClick={() => {
                      setHasAccount(!hasAccount);
                      setString('Register');
                      setregAdminStatus('Password');
                    }}
                    className={styles.registerButton}
                  >
                    <p>Don&apos;t have an account? Register</p>
                  </button>
                </div>
              )}
            </div>
            {error.length > 0 && <div><p>{error}</p></div>}
          </form>
        </div>
      )
  );
}

LoginPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
};
