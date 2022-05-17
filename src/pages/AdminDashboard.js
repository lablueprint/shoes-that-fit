import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// import axios from 'axios';
import DashboardOrders from '../components/DashboardOrders';
import InventorySummary from '../components/InventorySummary';
import Records from '../components/Records';
import styles from './AdminDashboard.module.css';

function AdminDashboard({
  // eslint-disable-next-line no-unused-vars
  isLoggedIn, username, password, profile, register, reRegister, onLogin, base,
}) {
  useEffect(() => {
    const setProfile = async () => {
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
        } else {
          await onLogin(username, password, profile, false, false);
        }
      });
    };
    if (register) {
      setProfile();
    }
    // const json = JSON.stringify({ username, password });
    // axios.post('http://localhost:8000/v0/appHz4HNC5OYabrnl/__airlock_register__', json, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then(async (response) => {
    //     if (response.status === 200) {
    //       console.log('CHANGED');
    //       await onLogin(username, password, profile, false, false);
    //     }
    //   })
    //   .catch((e2) => {
    //     console.log(e2);
    //   // incorrect username or password
    //   });
    const reRegisterUser = async () => {
      base.register({ username, password }).then(async () => {
        await onLogin(username, password, profile, false, false);
      }).catch((err) => {
        console.log(err);
      });
    };

    if (reRegister) {
      reRegisterUser();
    }
  }, []);

  return (
    !isLoggedIn ? (
      <Navigate to="/" />
    )
      : (
        <div className={styles.container}>
          <h1 className={styles.welcome}>Welcome Back, Admin</h1>
          <div className={styles.topComponents}>
            <DashboardOrders base={base} />
            <InventorySummary base={base} />
          </div>
          <div className={styles.recordContainer}>
            <Records base={base} />
          </div>
        </div>
      )
  );
}

export default AdminDashboard;

AdminDashboard.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    role: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    phone: PropTypes.string,
    contactName: PropTypes.string,
    schoolName: PropTypes.string,
    zipCode: PropTypes.string,
  }).isRequired,
  onLogin: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  register: PropTypes.bool.isRequired,
  reRegister: PropTypes.bool.isRequired,
  base: PropTypes.func.isRequired,
};
