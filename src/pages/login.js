/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function LoginPage({ isLoggedIn, onLogin }) {
  console.log(isLoggedIn);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Educator');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [string, setString] = useState('Log In');
  const [hasAccount, setHasAccount] = useState(true);

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

    axios.post('http://localhost:8000/v0/appHz4HNC5OYabrnl/__airlock_register__', json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('YAY');
          onLogin(username, password, role, true, false);
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

    axios.post('http://localhost:8000/v0/appHz4HNC5OYabrnl/__airlock_login__', json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          onLogin(username, password, role, false, false);
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
        <div className="loginWrapper">
          <h1>
            Please
            {` ${string}`}
          </h1>
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
            {string === 'Register' && (
            <label>
              <p>Confirm Password</p>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </label>
            )}
            {error.length > 0 && <div><p>{error}</p></div>}
            <div>
              {!hasAccount ? (
                <>
                  <button type="button" onClick={handleSignUp}> Register</button>
                  <p className="accountStatusParagraph">
                    Have an account?
                    {/* toggle the state when you click the button */}
                    <button
                      type="button"
                      onClick={() => {
                        setHasAccount(!hasAccount);
                        setString('Log In');
                        setError('');
                      }}
                    >
                      Log In
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
                  <button type="button" onClick={handleSignIn}> Log In</button>
                  <p className="accountStatusParagraph">
                    {' '}
                    No account?
                    <button
                      type="button"
                      onClick={() => {
                        setHasAccount(!hasAccount);
                        setString('Register');
                        setError('');
                      }}
                    >
                      Register
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
  isLoggedIn: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
};
