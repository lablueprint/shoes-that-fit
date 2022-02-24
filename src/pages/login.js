/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(airtableConfig.baseKey);

export default function LoginPage() {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasAccount, setHasAccount] = useState(false);

  const handleSignup = async (e) => {
    setError('');
    e.preventDefault();
    if (username.length === 0) {
      setError('Error: username cannot be empty.');
      return;
    }
    if (password.length === 0) {
      setError('Error: password cannot be empty.');
      return;
    }
    if (confirmPassword.length === 0) {
      setError('Error: must confirm password.');
      return;
    }
    if (role.length === 0) {
      setError('Error: must choose a role.');
      return;
    }
    if (password === confirmPassword) {
      base('Users').create(
        [
          {
            fields: {
              Username: username,
              Password: password,
              Role: role,
              // Role: role,
            },
          }],
        (err, records) => {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach((record) => {
            console.log(record.getId());
          });
        },
      );
      setPassword('');
      setUsername('');
      setConfirmPassword('');
      setRole('');
      setError('');
    } else {
      console.log("passwords don't match");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
  };

  return (
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
              <select value={role} onClick={(e) => setRole(e.target.value)}>
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

  );
}
