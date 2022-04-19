/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
};

const loginReducer = (state = { loggedIn: false }, action) => {
  switch (action.type) {
    case 'LOG_IN':
      state = { loggedIn: true };
      break;
    case 'LOG_OUT':
      state = { loggedIn: false };
      break;
    default:
      break;
  }
  return state;
};

const persistedReducer = persistReducer(persistConfig, loginReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { persistor };
export default store;
