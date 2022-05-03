import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, ClipboardList, ListOrdered, Gift, GraduationCap,
} from 'lucide-react';

import PropTypes from 'prop-types';
import styles from './nav.module.css';
import stfLogo from '../assets/STF_logo.png';

export default function Nav({ onLogout }) {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const linkArray = ['/admindashboard', '/inventory', '/newshoeform', '/orderform', '/adminlist', '/donations'];
  const textArray = ['Admin Dashboard', 'Inventory', 'New Shoe Form', 'Order Form', 'Admin List', 'Donations'];
  const iconArray = [Home, ClipboardList, Gift, ListOrdered, GraduationCap, Gift];

  return (
    <div className={styles.sidebar}>
      <img className={styles.stfLogo} src={stfLogo} alt="Shoes That Fit" />
      {iconArray.map((Icon, index) => {
        let ulNavClass = styles.navEntry;
        let navColor = '#FFFFFF';
        let linkClass = styles.linkStyles;
        if (selected === linkArray[index]) {
          ulNavClass = styles.selectedNavEntry;
          navColor = '#24275E';
          linkClass = styles.selectedLinkStyles;
        }
        return (
          <ul className={ulNavClass}>
            {/* eslint-disable-next-line max-len */}
            <Link to={linkArray[index]} className={linkClass} onClick={() => setSelected(linkArray[index])}>
              <div className={styles.navButtonText}>
                <Icon color={navColor} className={styles.iconPadding} />
                {textArray[index]}
              </div>
            </Link>
          </ul>
        );
      })}
      <Link to="/changePass">
        Reset Password
      </Link>
      <Link to="/" onClick={onLogout}>
        Logout
      </Link>
    </div>
  );
}

Nav.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
