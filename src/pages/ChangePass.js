/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function ChangePass({
  // eslint-disable-next-line no-unused-vars
  isLoggedIn, prevUser, prevPass, prevRole, onLogin, reRegister, base,
}) {
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [id, setId] = useState('');
  const [reset, setReset] = useState(false);

  const handleReset = async (e) => {
    let curError = '';
    setError('');
    e.preventDefault();

    if (oldPass.length === 0) {
      curError = 'Error: previous password cannot be empty.';
      setError(curError);
      return;
    }

    if (password.length === 0) {
      curError = 'Error: password cannot be empty.';
      setError(curError);
      return;
    }

    if (password !== confirmPassword) {
      curError = 'Error: confirm password cannot be empty';
      setError(curError);
      return;
    }
    if (password === prevPass) {
      curError = 'Error: Password must not match prev password';
      setError(curError);
      return;
    }
    if (oldPass !== prevPass) {
      curError = 'Error: Old password does not match';
      setError(curError);
      return;
    }

    await base('Users').select({ filterByFormula: `Username = "${prevUser}"` }).all()
      .then(async (records) => {
        setId(records[0].id);
        await base('Users').destroy([records[0].id], async (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('DELETED');
            await onLogin(prevUser, password, prevRole, false, true);
          }
        });
      });
  };

  if (reRegister) {
    return (
      <Navigate to="/admindashboard" />
    );
  }

  return (
    (!isLoggedIn)
      ? (
        <Navigate to="/" />
      )
      : (
        <div className="loginWrapper">
          <h1>Reset Password</h1>
          {/* <form onSubmit={onSubmit}> */}
          <form>
            <label>
              <p>Enter Previous Password</p>
              <input type="text" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
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
              <br />
              <button type="button" onClick={handleReset}> Reset </button>
            </div>
          </form>
        </div>
      )
  );
}

ChangePass.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  prevPass: PropTypes.string.isRequired,
  prevRole: PropTypes.string.isRequired,
  reRegister: PropTypes.bool.isRequired,
  prevUser: PropTypes.string.isRequired,
  onLogin: PropTypes.func.isRequired,
  base: PropTypes.func.isRequired,
};
