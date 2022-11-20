import React from 'react';
import { NavLink, Link /* useLocation */ } from 'react-router-dom';
import {
  Home, ClipboardList, ListOrdered, Gift, GraduationCap,
} from 'lucide-react';

import PropTypes from 'prop-types';
import styles from './nav.module.css';
import stfLogo from '../assets/STF_logo.png';

export default function Nav({ isLoggedIn, onLogout, profile }) {
  // const location = useLocation();
  // const [selected, setSelected] = useState(location.pathname);
  const adminLinkArray = ['/admindashboard', '/inventory', '/newshoeform', '/orderform', '/adminlist', '/donations'];
  const adminTextArray = ['Admin Dashboard', 'Inventory', 'New Shoe Form', 'Order Form', 'Admin List', 'Donations'];
  const adminIconArray = [Home, ClipboardList, Gift, ListOrdered, GraduationCap, Gift];

  const educatorLinkArray = ['orderhistory', '/orderform'];
  const educatorTextArray = ['Order History', 'Order Form'];
  const educatorIconArray = [ListOrdered, ClipboardList];

  return (
    isLoggedIn
      ? ((profile.role === 'Educator'
        && (
          <div className={styles.sidebar}>
            <img className={styles.stfLogo} src={stfLogo} alt="Shoes That Fit" />
            {educatorIconArray.map((Icon, index) => (
              <ul key={educatorTextArray[index]} className={styles.navEntry}>
                <NavLink
                  to={educatorLinkArray[index]}
                  className={
                      ({ isActive }) => (isActive
                        ? styles.selectedLinkStyles
                        : styles.linkStyles)
                    }
                >
                  <div className={styles.navButtonText}>
                    <Icon className={styles.iconPadding} />
                    {educatorTextArray[index]}
                  </div>
                </NavLink>
              </ul>
            ))}
            <Link to="/changePass" style={{ color: 'white' }}>
              Reset Password
            </Link>
            <Link to="/" onClick={onLogout} style={{ color: 'white' }}>
              Logout
            </Link>
          </div>
        ))
       || ((profile.role === 'Admin'
      && (
        <div className={styles.sidebar}>
          <img className={styles.stfLogo} src={stfLogo} alt="Shoes That Fit" />
          {adminIconArray.map((Icon, index) => (
            <ul key={adminTextArray[index]} className={styles.navEntry}>
              <NavLink
                to={adminLinkArray[index]}
                className={
                    ({ isActive }) => (isActive
                      ? styles.selectedLinkStyles
                      : styles.linkStyles)
                  }
              >
                <div className={styles.navButtonText}>
                  <Icon className={styles.iconPadding} />
                  {adminTextArray[index]}
                </div>
              </NavLink>
            </ul>
          ))}
          <Link to="/changePass" style={{ color: 'white' }}>
            Reset Password
          </Link>
          <Link to="/" onClick={onLogout} style={{ color: 'white' }}>
            Logout
          </Link>
        </div>
      ))))
      : null
  );
}

Nav.propTypes = {
  onLogout: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
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
};
