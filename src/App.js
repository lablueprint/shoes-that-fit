import React, { /* useEffect */ } from 'react';
import './styles/App.css';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Airtable from '@calblueprint/airlock';
import { Nav, NavLogin } from './components';
import {
  MainInventory,
  NewShoeForm,
  AdminList,
  OrderForm,
  LoginPage,
  RecordPage,
  AdminDashboard,
  LogDonations,
  Donations,
  DonationConfirmation,
  DonationDetails,
  OrderHistory,
  SchoolsForm,
  SchoolsDetail,
  ChangePass,
  Portal,
  Schools,
  RemoveShoeForm,
} from './pages';

const BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_KEY;
const ENDPOINT_URL = 'http://localhost:8000';

Airtable.configure({
  endpointUrl: ENDPOINT_URL,
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
});

const base = Airtable.base(BASE_ID);

function App({
  isLoggedIn, username, password, profile, register, reRegister, login, logout,
}) {
  // useEffect(() => {
  //   const loginUser = async (user, pass) => {
  //     try {
  //       const res = await base.login({ user, pass });
  //       if (!res.body.success) {
  //         return { match: false, found: false };
  //       }
  //       return { match: true, found: true };
  //     } catch (err) {
  //       if (err.error === 'AUTHENTICATION_REQUIRED') {
  //         return { match: false, found: true };
  //       }
  //       return { match: false, found: false };
  //     }
  //   };

  //   if (isLoggedIn) {
  //     loginUser(username, password);
  //   }
  // }, [isLoggedIn, username, password]);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <>
          <NavLogin />
          <div className="App-container">
            <Routes>
              <Route exact path="/" element={<Portal />} />
              <Route
                path="/login"
                element={(
                  <LoginPage
                    isLoggedIn={isLoggedIn}
                    onLogin={login}
                    base={base}
                  />
                )}
              />
            </Routes>
          </div>
        </>
      ) : (
        <>
          <Nav isLoggedIn={isLoggedIn} onLogout={logout} profile={profile} />
          <div className="App-container">
            <Routes>
              <Route
                path="/"
                element={(
                  <AdminDashboard
                    isLoggedIn={isLoggedIn}
                    username={username}
                    password={password}
                    onLogin={login}
                    profile={profile}
                    register={register}
                    reRegister={reRegister}
                    base={base}
                  />
                )}
              />
              <Route
                path="/login"
                element={(
                  <AdminDashboard
                    isLoggedIn={isLoggedIn}
                    username={username}
                    password={password}
                    onLogin={login}
                    profile={profile}
                    register={register}
                    reRegister={reRegister}
                    base={base}
                  />
                )}
              />
              <Route
                path="/admindashboard"
                element={(
                  <AdminDashboard
                    isLoggedIn={isLoggedIn}
                    username={username}
                    password={password}
                    onLogin={login}
                    profile={profile}
                    register={register}
                    reRegister={reRegister}
                    base={base}
                  />
                )}
              />
              <Route
                path="/inventory"
                element={(
                  <MainInventory
                    isLoggedIn={isLoggedIn}
                    username={username}
                    password={password}
                    base={base}
                  />
                )}
              />
              <Route
                path="/newshoeform"
                element={(
                  <NewShoeForm
                    isLoggedIn={isLoggedIn}
                    base={base}
                  />
                )}
              />
              <Route
                path="/removeshoeform"
                element={(
                  <RemoveShoeForm
                    isLoggedIn={isLoggedIn}
                    base={base}
                  />
                )}
              />
              <Route
                path="/adminlist"
                element={(
                  <AdminList
                    isLoggedIn={isLoggedIn}
                    base={base}
                    profile={profile}
                    username={username}
                  />
                )}
              />
              <Route
                path="/orderform"
                element={(
                  <OrderForm
                    isLoggedIn={isLoggedIn}
                    base={base}
                  />
                )}
              />
              <Route
                path="/adminlist"
                element={(
                  <AdminList
                    isLoggedIn={isLoggedIn}
                    base={base}
                    profile={profile}
                    username={username}
                  />
                )}
              />
              <Route
                path="/records"
                element={(
                  <RecordPage
                    isLoggedIn={isLoggedIn}
                    base={base}
                  />
                )}
              />
              <Route
                path="/changePass"
                element={(
                  <ChangePass
                    isLoggedIn={isLoggedIn}
                    reRegister={reRegister}
                    prevUser={username}
                    prevProfile={profile}
                    prevPass={password}
                    onLogin={login}
                    base={base}
                  />
                )}
              />
              <Route path="/orderhistory" element={<OrderHistory base={base} profile={profile} username={username} />} />
              <Route path="/donations" element={<Donations base={base} />} />
              <Route path="/donationdetails" element={<DonationDetails />} />
              <Route path="/logdonations" element={<LogDonations />} />
              <Route path="/confirmdonation" element={<DonationConfirmation username={username} base={base} />} />
              <Route path="/schoolsform" element={<SchoolsForm base={base} />} />
              <Route path="/schoolsdetail" element={<SchoolsDetail base={base} />} />
              <Route path="/schools" element={<Schools base={base} />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    username: state.username,
    password: state.password,
    register: state.register,
    reRegister: state.reRegister,
    profile: state.profile,
  };
}

const mapDispatchToProps = (dispatch) => ({
  // dispatching plain actions
  login: (username, password, profile, register, reRegister) => dispatch({
    type: 'LOG_IN',
    payload: {
      username, password, profile, register, reRegister,
    },
  }),
  logout: () => dispatch({ type: 'LOG_OUT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
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
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  register: PropTypes.bool.isRequired,
  reRegister: PropTypes.bool.isRequired,
};
