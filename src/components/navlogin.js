import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  User, GraduationCap,
} from 'lucide-react';
import styles from './navlogin.module.css';
import stfLogo from '../assets/STF_logo.png';

export default function NavLogin() {
  const location = useLocation();
  const role = location.state ? location.state.role : '';

  if (role.length === 0) {
    return (
      <div className={styles.sidebar}>
        <img className={styles.stfLogo} src={stfLogo} alt="Shoes That Fit" />
        <p>Online Portal</p>
      </div>
    );
  }

  return (
    (role === 'Admin') ? (
      <div className={styles.sidebar}>
        <img className={styles.stfLogo} src={stfLogo} alt="Shoes That Fit" />
        <div className={styles.align}>
          <User size={20} />
          <p>Admin Portal</p>
        </div>
      </div>
    ) : (
      <div className={styles.sidebar}>
        <img className={styles.stfLogo} src={stfLogo} alt="Shoes That Fit" />
        <div className={styles.align}>
          <GraduationCap size={20} />
          <p>Educator Portal</p>
        </div>

      </div>
    )
  );
}
