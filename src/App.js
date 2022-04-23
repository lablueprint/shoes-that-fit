import React from 'react';
import './styles/App.css';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Nav } from './components';
import {
  MainInventory, NewShoeForm, AdminList, OrderForm, LoginPage, Records, AdminDashboard,
} from './pages';

function App({ isLoggedIn, login, logout }) {
  console.log(isLoggedIn);
  return (
    <div className="App">
      <Nav loggedIn={isLoggedIn} />
      <Routes>
        <Route
          path="/inventory"
          element={(
            <MainInventory
              loggedIn={isLoggedIn}
              onLogout={logout}
            />
        )}
        />
        <Route
          exact
          path="/"
          element={(
            <LoginPage
              loggedIn={isLoggedIn}
              onLogin={login}
            />
        )}
        />
        <Route
          path="/newshoeform"
          element={(
            <NewShoeForm
              loggedIn={isLoggedIn}
              onLogout={logout}
            />
        )}
        />
        <Route
          path="/orderform"
          element={(
            <OrderForm
              loggedIn={isLoggedIn}
              onLogout={logout}
            />
        )}
        />
        <Route
          path="/adminlist"
          element={(
            <AdminList
              loggedIn={isLoggedIn}
              onLogout={logout}
            />
        )}
        />
        <Route path="/records" element={<Records />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.loggedIn,
  };
}

const mapDispatchToProps = (dispatch) => ({
  // dispatching plain actions
  login: () => dispatch({ type: 'LOG_IN' }),
  logout: () => dispatch({ type: 'LOG_OUT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};
