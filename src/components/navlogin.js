import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  User, GraduationCap,
} from 'lucide-react';
import styles from './nav.module.css';
import stfLogo from '../assets/STF_logo.png';

export default function NavLogin() {
  const location = useLocation();
  const { role } = location.state;
  return (
    (role === 'Admin') ? (
      <div className={styles.sidebar}>
        <img className={styles.stfLogo} src={stfLogo} alt="Shoes That Fit" />
        <User size={20} />
        Admin Portal
      </div>
    ) : (
      <div className={styles.sidebar}>
        <img className={styles.stfLogo} src={stfLogo} alt="Shoes That Fit" />
        <GraduationCap size={20} />
        Educator Portal
      </div>
    )
  );
}
