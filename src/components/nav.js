import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, ClipboardList, ListOrdered, Gift, GraduationCap,
} from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './nav.module.css';
import stfLogo from '../assets/STF_logo.png';

export default function Nav({ loggedIn }) {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const linkArray = ['/home', '/inventory', '/newshoeform', '/orderform', '/adminlist', '/admindashboard'];
  const textArray = ['Home', 'Inventory', 'New Shoe Form', 'Order Form', 'Admin List', 'Admin Dashboard'];
  const iconArray = [Home, ClipboardList, Gift, ListOrdered, GraduationCap, Home];

  return (
    !loggedIn ? (null)
      : (
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
              <ul key={textArray[index]} className={ulNavClass}>
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
        </div>
      )
  );
}

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};
