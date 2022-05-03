import React, { useEffect } from 'react';
import './styles/App.css';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Airtable from '@calblueprint/airlock';
import { Nav } from './components';
import {
  MainInventory, NewShoeForm, AdminList, OrderForm, LoginPage, Records,
  AdminDashboard, Donations, DonationConfirmation, OrderListAdmin, OrderHistory,
  ChangePass,
} from './pages';

const BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_KEY;
const API_KEY = process.env.REACT_APP_AIRTABLE_USER_KEY;
const ENDPOINT_URL = 'http://localhost:8000';

Airtable.configure({
  endpointUrl: ENDPOINT_URL,
  apiKey: API_KEY,
});

const base = Airtable.base(BASE_ID);

function App({
  // eslint-disable-next-line react/prop-types
  isLoggedIn, username, password, role, register, reRegister, login, logout,
}) {
  useEffect(() => {
    const loginUser = async (user, pass) => {
      try {
        const res = await base.login({ user, pass });
        if (!res.body.success) {
          return { match: false, found: false };
        }
        return { match: true, found: true };
      } catch (err) {
        if (err.error === 'AUTHENTICATION_REQUIRED') {
          return { match: false, found: true };
        }
        return { match: false, found: false };
      }
    };

    if (isLoggedIn) {
      loginUser(username, password);
    }
  }, [isLoggedIn, username, password]);

  return (
    <div className="App">
      <Nav onLogout={logout} />
      <div className="App-container">
        <Routes>
          <Route
            path="/admindashboard"
            element={(
              <AdminDashboard
                isLoggedIn={isLoggedIn}
                username={username}
                password={password}
                onLogin={login}
                role={role}
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
            exact
            path="/"
            element={(
              <LoginPage
                isLoggedIn={isLoggedIn}
                onLogin={login}
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
              />
        )}
          />
          <Route
            path="/records"
            element={(
              <Records
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
                prevRole={role}
                prevPass={password}
                onLogin={login}
                base={base}
              />
        )}
          />
          <Route path="/viewhistory" element={<OrderListAdmin />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/confirmdonation" element={<DonationConfirmation />} />
        </Routes>
      </div>
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
    role: state.role,
  };
}

const mapDispatchToProps = (dispatch) => ({
  // dispatching plain actions
  login: (username, password, role, register, reRegister) => dispatch({
    type: 'LOG_IN',
    payload: {
      username, password, role, register, reRegister,
    },
  }),
  logout: () => dispatch({ type: 'LOG_OUT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  register: PropTypes.bool.isRequired,
  reRegister: PropTypes.bool.isRequired,
};
