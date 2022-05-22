import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
// import axios from 'axios';
import PropTypes from 'prop-types';

export default function LoginPage({ isLoggedIn, onLogin, base }) {
  console.log(isLoggedIn);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Educator');
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

    // await axios.post('http://localhost:8000/v0/appHz4HNC5OYabrnl/__airlock_register__', json, {
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
    // await axios.post('http://localhost:8000/v0/appHz4HNC5OYabrnl/__airlock_login__', json, {
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
        <div className="loginWrapper">
          <form>
            <h1>
              Please
              {` ${string}`}
            </h1>
            {string === 'Log In' && (
              <>
                <label>
                  <p>Email </p>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                  <p>Password </p>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
              </>
            )}
            <div>
              {!hasAccount ? (
                <>
                  {string === 'Register' && (
                  <>
                    <div>
                      <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option> Educator</option>
                        <option> Administrator</option>
                      </select>
                      <h3>
                        Contact Information
                      </h3>
                      <p>Email </p>
                      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                      <p>Contact Name </p>
                      <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                      <p>Phone </p>
                      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
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

                    <br />
                    <label>
                      <p>Password </p>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <label>
                      <p>Confirm Password </p>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </label>
                  </>
                  )}
                  <br />
                  <br />

                  <button type="button" onClick={handleSignUp}> Register</button>
                  <br />

                  <p className="accountStatusParagraph">
                    Have an account?
                    {/* toggle the state when you click the button */}
                    <button
                      type="button"
                      onClick={() => {
                        setHasAccount(!hasAccount);
                        setString('Log In');
                      }}
                    >
                      Sign In
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <br />
                  <button type="button" onClick={handleSignIn}>
                    {' '}
                    Log In
                  </button>
                  <br />
                  <p className="accountStatusParagraph">
                    {' '}
                    Don&apos;t have an account?
                    {' '}
                    <button
                      type="button"
                      onClick={() => {
                        setHasAccount(!hasAccount);
                        setString('Register');
                      }}
                    >
                      Register
                    </button>
                  </p>
                </>
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
  base: PropTypes.func.isRequired,
};
