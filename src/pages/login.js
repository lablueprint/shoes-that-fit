/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [isEducator, setRole] = useState(True);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(username);
    console.log(password);
  };

  // const useStyles = makeStyles({

  //   loginWrapper: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     alignItems: 'center',
  //   },
  // });

  // const classes = useStyles();

  return (
    // <div className={classes.loginWrapper}>
    <div className="loginWrapper">
      <h1>Please Log In</h1>
      <form onSubmit={onSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>

  );
}
