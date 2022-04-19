/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';

// const Airtable = require('airtable');

// const airtableConfig = {
//   apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
//   baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
// };

// const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(airtableConfig.baseKey);

export default function LoginPage({ loggedIn, onLogin }) {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Educator');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(loggedIn);

  // const clearState = (errorMsg) => {
  //   setError(errorMsg);
  //   setPassword('');
  //   setUsername('');
  //   setConfirmPassword('');
  //   setRole('Educator');
  // };

  const handleSignup = async (e) => {
    let curError = '';
    setError('');
    console.log(role);
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
    if (role.length === 0) {
      console.log(role);
      curError = 'Error: must choose a role.';
      setError(curError);
      // return;
    }

    const json = JSON.stringify({ username, password });
    const token = 'keyYheV6VxT2I65Z3';

    axios.post('http://localhost:8000/v0/appHz4HNC5OYabrnl/__airlock_register__', json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('YAY');
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

    // base('Users').select({ filterByFormula: `Username = "${username}"` }).all().then((res) => {
    //   if (res.length !== 0) {
    //     curError = 'Error: Username already exists';
    //     clearState(curError);
    //   } else if (curError.length === 0) {
    //     if (password === confirmPassword) {
    //       base('Users').create(
    //         [
    //           {
    //             fields: {
    //               Username: username,
    //               Password: password,
    //               Role: role,
    //               // Role: role,
    //             },
    //           }],
    //         (err, records) => {
    //           if (err) {
    //             console.error(err);
    //             return;
    //           }
    //           records.forEach((record) => {
    //             console.log(record.getId());
    //           });
    //         },
    //       );
    //       clearState('');
    //     } else {
    //       console.log("passwords don't match");
    //     }
    //   }
    // });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    let curError = '';
    setError('');
    // base('Users').select({ filterByFormula: `Username = "${username}"` }).all().then((res) => {
    //   console.log(res);
    // });
    const json = JSON.stringify({ username, password });
    const token = 'keyYheV6VxT2I65Z3';

    axios.post('http://localhost:8000/v0/appHz4HNC5OYabrnl/__airlock_login__', json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          onLogin(username);
          setLoggedIn(true);
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
        <Navigate to="/home" />
      )
      : (
        <div className="loginWrapper">
          <h1>Please Log In</h1>
          {/* <form onSubmit={onSubmit}> */}
          <form>
            <label>
              <p>Username</p>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
              <p>Password</p>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
              <p>Confirm Password</p>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </label>
            {error.length > 0 && <div><p>{error}</p></div>}
            <div>
              {hasAccount ? (
                <>
                  <button type="button" onClick={handleSignIn}> Sign In</button>
                  <p className="accountStatusParagraph">
                    No account?
                    {/* toggle the state when you click the button */}
                    <button
                      type="button"
                      onClick={() => setHasAccount(!hasAccount)}
                    >
                      Sign up
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option> Educator</option>
                    <option> Administrator</option>
                  </select>
                  <br />
                  <button type="button" onClick={handleSignup}> Sign up</button>
                  <p className="accountStatusParagraph">
                    {' '}
                    Have an account?
                    <button
                      type="button"
                      onClick={() => setHasAccount(!hasAccount)}
                    >
                      Sign In
                    </button>
                  </p>
                </>
              )}
            </div>
          </form>
        </div>
      )
  );
}

LoginPage.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
};
