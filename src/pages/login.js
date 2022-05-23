import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
import PropTypes from 'prop-types';
import { ChevronLeft } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage({ isLoggedIn, onLogin, base }) {
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
  const [regEdStatus, setregEdStatus] = useState('Password');

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

    // const json = JSON.stringify({ username, password });

    // await axios.post('http://localhost:8000/v0/REACT_APP_AIRTABLE_BASE_KEY/__airlock_register__', json, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then(async (response) => {
    //     if (response.status === 200) {
    //       console.log('YAY');
    //       const profile = {
    //         role,
    //         contactName,
    //         schoolName,
    //         address,
    //         city,
    //         state,
    //         zipCode,
    //         phone,
    //       };
    //       await onLogin(username, password, profile, true, false);
    //       // go to home page and/or confirm email
    //       // set redux that user is logged in
    //     }
    //   })
    //   .catch((e2) => {
    //     console.log(e2);
    //     curError = 'Error: Incorrect password.';
    //     setError(curError);
    //     // incorrect username or password
    //   });

    await base.register({ username, password }).then(async (res) => {
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

      await base('Profile').create([
        {
          fields: {
            Username: username,
            Role: profile.role,
            Address: profile.address,
            City: profile.city,
            State: profile.state,
            Phone: profile.phone,
            ContactName: profile.contactName,
            SchoolName: profile.schoolName,
            ZipCode: profile.zipCode,
          },
        },
      ], async (err) => {
        if (err) {
          console.error(err);
        }
        // else {
        //   await onLogin(username, password, profile, false, false);
        // }
      });

      await onLogin(username, res.body.user.fields.Password, profile, true, false);
    }).catch((err) => {
      console.log(err);
      curError = 'Error: Incorrect password.';
      setError(curError);
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

    // const json = JSON.stringify({ username, password });

    // await axios.post('http://localhost:8000/v0/REACT_APP_AIRTABLE_BASE_KEY/__airlock_login__', json, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then(async (response) => {
    //     if (response.status === 200) {
    //       const profile = {
    //         role,
    //         contactName,
    //         schoolName,
    //         address,
    //         city,
    //         state,
    //         zipCode,
    //         phone,
    //       };

    //       await onLogin(username, password, profile, false, false);
    //       // go to home page and set login user in redux
    //     }
    //   })
    //   .catch((e2) => {
    //     console.log(e2);
    //     curError = 'Error: Incorrect username or password.';
    //     setError(curError);
    //     // incorrect username or password
    //   });

    await base.login({ username, password }).then(async (res) => {
      let profile = {};
      await base('Profile')
        .select({
          view: 'Grid view',
          filterByFormula: `{Username} = "${username}"`,
        }).all()
        .then((records) => {
          const tempProfile = records[0].fields;
          profile = {
            role: tempProfile.Role,
            contactName: tempProfile.ContactName,
            schoolName: tempProfile.SchoolName,
            address: tempProfile.Address,
            city: tempProfile.City,
            state: tempProfile.State,
            zipCode: tempProfile.ZipCode,
            phone: tempProfile.Phone,
          };
        });
      await onLogin(username, res.body.user.fields.Password, profile, false, false);
    }).catch((err) => {
      console.log(err);
      curError = 'Error: Incorrect username or password.';
      setError(curError);
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

          {/* <h1 className={styles.top}>
            Please
            {` ${string}`}
          </h1> */}
          <form>
            <h1>
              Please
              {` ${string}`}
            </h1>
            {string === 'Log In' && (
              <div className={styles.bigcol}>
                <h1 className={styles.top}>
                  Please
                  {` ${string}`}
                </h1>
                <label className={styles.col}>
                  <p>Email Address</p>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label className={styles.col}>
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
                    {regAdminStatus === 'Password' && role === 'Admin' && (
                    <div>
                      <div className={styles.top}>
                        <ChevronLeft
                          size={30}
                          type="button"
                          onClick={() => {
                            setHasAccount(!hasAccount);
                            setString('Log In');
                          }}
                        />
                        <h1>
                          Please
                          {` ${string}`}
                        </h1>
                      </div>

                      <div className={styles.bigcol}>

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
                          <div className={styles.center}>
                            <button className={styles.blue} type="button" onClick={() => { setregAdminStatus('Login'); }}> Next</button>
                          </div>

                        </div>

                      </div>

                    </div>

                    )}
                    {regAdminStatus === 'Login' && role === 'Admin' && (
                      <div>
                        <div className={styles.top}>
                          <ChevronLeft
                            size={30}
                            type="button"
                            onClick={() => {
                              setregAdminStatus('Password');
                            }}
                          />
                          <h1>
                            Please
                            {` ${string}`}
                          </h1>
                        </div>
                        <div className={styles.bigcol}>
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
                        </div>
                        <div className={styles.space} />
                        <div className={styles.space} />

                        <button className={styles.blue} type="button" onClick={handleSignUp}> Register</button>
                      </div>
                    )}

                    {regEdStatus === 'Password' && role === 'Educator' && (
                      <div>
                        <div className={styles.top}>
                          <ChevronLeft
                            size={30}
                            type="button"
                            onClick={() => {
                              setHasAccount(!hasAccount);
                              setString('Log In');
                            }}
                          />
                          <h1>
                            Please
                            {` ${string}`}
                          </h1>
                        </div>

                        <div className={styles.bigcol}>
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

                            <div className={styles.center}>
                              <button className={styles.blue} type="button" onClick={() => { setregEdStatus('Login'); }}> Next</button>
                            </div>

                          </div>

                        </div>
                      </div>

                    )}
                    {role === 'Educator'
                    && regEdStatus === 'Login' && (
                    <div>
                      <div className={styles.top}>
                        <ChevronLeft
                          size={30}
                          type="button"
                          onClick={() => {
                            setregEdStatus('Password');
                          }}
                        />
                        <h1>
                          Please
                          {` ${string}`}
                        </h1>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.bigcol}>
                          <h3>
                            School Information
                          </h3>
                          <div className={styles.col}>
                            <p>School Name </p>
                            <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                          </div>
                          <div className={styles.col}>
                            <p>Address </p>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                          </div>
                          <div className={styles.row}>
                            <div className={styles.city}>
                              <p>City </p>
                              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                            <div className={styles.state}>
                              <p>State </p>
                              <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
                            </div>
                          </div>

                          <div className={styles.col}>
                            <p>Zip Code </p>
                            <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                          </div>
                        </div>

                        <div className={styles.col}>
                          <h3>
                            Personal Information
                          </h3>
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

                          <div className={styles.col}>
                            <p>Email Address </p>
                            <input id={styles.grey} value={username} readOnly />
                          </div>

                          <div className={styles.col}>
                            <p>Password </p>
                            <input id={styles.grey} type="password" value={password} readOnly />
                          </div>
                          <div className={styles.space} />
                        </div>
                      </div>
                      <div className={styles.center}>
                        <button className={styles.blue} type="button" onClick={handleSignUp}> Register</button>
                      </div>

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
                  <div className={styles.center}>
                    <button
                      type="button"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </button>

                    {error.length > 0 && <div><p>{error}</p></div>}

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
                </div>
              )}
            </div>
            {/* {error.length > 0 && <div><p>{error}</p></div>} */}
          </form>
        </div>
      )
  );
}

LoginPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  base: PropTypes.func.isRequired,
};
