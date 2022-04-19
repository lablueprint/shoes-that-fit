import React from 'react';
import './styles/App.css';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Header, Nav } from './components';
import {
  Home, MainInventory, NewShoeForm, AdminList, OrderForm, LoginPage,
} from './pages';

function App({
  isLoggedIn, username, login, logout,
}) {
  console.log(isLoggedIn);
  return (
    <div className="App">
      <Header />
      <Nav loggedIn={isLoggedIn} />
      <Routes>
        <Route
          exact
          path="/home"
          element={(
            <Home
              loggedIn={isLoggedIn}
              username={username}
              onLogout={logout}
            />
        )}
        />
        <Route
          path="/inventory"
          element={(
            <MainInventory
              loggedIn={isLoggedIn}
              username={username}
              onLogout={logout}
            />
        )}
        />
        <Route
          path="/"
          element={(
            <LoginPage
              loggedIn={isLoggedIn}
              username={username}
              onLogin={login}
            />
        )}
        />
        <Route
          path="/newshoeform"
          element={(
            <NewShoeForm
              loggedIn={isLoggedIn}
              username={username}
              onLogout={logout}
            />
        )}
        />
        <Route
          path="/orderform"
          element={(
            <OrderForm
              loggedIn={isLoggedIn}
              username={username}
              onLogout={logout}
            />
        )}
        />
        <Route
          path="/adminlist"
          element={(
            <AdminList
              loggedIn={isLoggedIn}
              username={username}
              onLogout={logout}
            />
        )}
        />
      </Routes>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.loggedIn,
    username: state.username,
  };
}

const mapDispatchToProps = (dispatch) => ({
  // dispatching plain actions
  login: (username) => dispatch({ type: 'LOG_IN', payload: username }),
  logout: () => dispatch({ type: 'LOG_OUT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};
