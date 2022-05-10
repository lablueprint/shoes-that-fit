/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
};

const loginReducer = (state = {
  isLoggedIn: false, username: '', password: '', role: '', register: false, reRegister: false,
}, action) => {
  switch (action.type) {
    case 'LOG_IN':
      state = {
        isLoggedIn: true,
        username: action.payload.username,
        password: action.payload.password,
        role: action.payload.role,
        register: action.payload.register,
        reRegister: action.payload.reRegister,
      };
      break;
    case 'LOG_OUT':
      state = {
        isLoggedIn: false,
        username: '',
        password: '',
        role: '',
        register: false,
        reRegister: false,
      };
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
