import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, ClipboardList, ListOrdered, Gift, GraduationCap,
} from 'lucide-react';
import styles from './nav.module.css';

function Nav() {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const linkArray = ['/home', '/inventory', '/newshoeform', '/orderform', '/adminlist', '/admindashboard'];
  const textArray = ['Home', 'Inventory', 'New Shoe Form', 'Order Form', 'Admin List', 'Admin Dashboard'];
  const iconArray = [Home, ClipboardList, Gift, ListOrdered, GraduationCap, Home];

  return (
    <div className={styles.sidebar}>
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
    </div>
  );
}

export default Nav;
