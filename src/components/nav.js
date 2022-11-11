import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, ClipboardList, ListOrdered, Gift, GraduationCap,
} from 'lucide-react';

import PropTypes from 'prop-types';
import styles from './nav.module.css';
import stfLogo from '../assets/STF_logo.png';

export default function Nav({ isLoggedIn, onLogout, profile }) {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
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
            {educatorIconArray.map((Icon, index) => {
              let ulNavClass = styles.navEntry;
              let navColor = '#FFFFFF';
              let educatorLinkClass = styles.linkStyles;
              if (selected === educatorLinkArray[index]) {
                ulNavClass = styles.selectedNavEntry;
                navColor = '#24275E';
                educatorLinkClass = styles.selectedLinkStyles;
              }
              return (
                <ul className={ulNavClass}>
                  {/* eslint-disable-next-line max-len */}
                  <Link to={educatorLinkArray[index]} className={educatorLinkClass} onClick={() => setSelected(educatorLinkArray[index])}>
                    <div className={styles.navButtonText}>
                      <Icon color={navColor} className={styles.iconPadding} />
                      {educatorTextArray[index]}
                    </div>
                  </Link>
                </ul>
              );
            })}
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
          {adminIconArray.map((Icon, index) => {
            let ulNavClass = styles.navEntry;
            let navColor = '#FFFFFF';
            let adminLinkClass = styles.linkStyles;
            if (selected === adminLinkArray[index]) {
              ulNavClass = styles.selectedNavEntry;
              navColor = '#24275E';
              adminLinkClass = styles.selectedLinkStyles;
            }
            return (
              <ul key={adminLinkArray[index]} className={ulNavClass}>
                {/* eslint-disable-next-line max-len */}
                <Link to={adminLinkArray[index]} className={adminLinkClass} onClick={() => setSelected(adminLinkArray[index])}>
                  <div className={styles.navButtonText}>
                    <Icon color={navColor} className={styles.iconPadding} />
                    {adminTextArray[index]}
                  </div>
                </Link>
              </ul>
            );
          })}
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
