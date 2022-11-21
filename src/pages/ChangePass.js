/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ChangePass({
  isLoggedIn, prevUser, prevProfile, onLogin, reRegister, base,
}) {
  const [error, setError] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const username = prevUser;

  const handleReset = async (e) => {
    let curError = '';
    setError('');
    e.preventDefault();

    if (oldPass.length === 0) {
      curError = 'Error: Previous password cannot be empty.';
      setError(curError);
      return;
    }

    if (newPass.length === 0) {
      curError = 'Error: Password cannot be empty.';
      setError(curError);
      return;
    }

    if (newPass !== confirmPassword) {
      curError = 'Error: Confirm password cannot be empty';
      setError(curError);
      return;
    }
    // if (password === prevPass) {
    //   curError = 'Error: Password must not match prev password';
    //   setError(curError);
    //   return;
    // }
    // if (oldPass !== prevPass) {
    //   curError = 'Error: Prev password does not match';
    //   setError(curError);
    //   return;
    // }
    await base.login({ username, password: oldPass }).then(() => {
    }).catch((err) => {
      console.log(err);
      curError = 'Error: Incorrect previous password';
      setError(curError);
    });

    await base.login({ username, password: newPass }).then(() => {
      curError = 'Error: Password must not match previous password';
      setError(curError);
    }).catch((err) => {
      console.log(err);
    });
    if (curError !== '') {
      return;
    }

    await base('Users').select({ filterByFormula: `Username = "${prevUser}"` }).all()
      .then(async (records) => {
        await base('Users').destroy([records[0].id], async (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('DELETED');
            await onLogin(prevUser, newPass, prevProfile, false, true);
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
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
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
  // eslint-disable-next-line react/forbid-prop-types
  prevProfile: PropTypes.object.isRequired,
  reRegister: PropTypes.bool.isRequired,
  prevUser: PropTypes.string.isRequired,
  onLogin: PropTypes.func.isRequired,
  base: PropTypes.func.isRequired,
};
