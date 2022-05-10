import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, ClipboardList, ListOrdered, Gift, GraduationCap,
} from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './nav.module.css';
import stfLogo from '../assets/STF_logo.png';

export default function Nav({ loggedIn }) {
  const linkArray = ['/home', '/inventory', '/newshoeform', '/orderform', '/adminlist', '/admindashboard', '/logdonations'];
  const textArray = ['Home', 'Inventory', 'New Shoe Form', 'Order Form', 'Admin List', 'Admin Dashboard', 'Donations'];
  const iconArray = [Home, ClipboardList, Gift, ListOrdered, GraduationCap, Home, Gift];

  return (
    !loggedIn ? (null)
      : (
        <div className={styles.sidebar}>
          <img className={styles.stfLogo} src={stfLogo} alt="Shoes That Fit" />
          {iconArray.map((Icon, index) => (
            <ul key={textArray[index]} className={styles.navEntry}>
              <NavLink
                to={linkArray[index]}
                className={
                    ({ isActive }) => (isActive
                      ? styles.selectedLinkStyles
                      : styles.linkStyles)
                  }
              >
                <div className={styles.navButtonText}>
                  <Icon className={styles.iconPadding} />
                  {textArray[index]}
                </div>
              </NavLink>
            </ul>
          ))}
        </div>
      )
  );
}

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};
