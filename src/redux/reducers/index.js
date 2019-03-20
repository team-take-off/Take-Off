import { combineReducers } from 'redux';
import adminMode from './adminMode';
import errors from './errorsReducer';
import loginMode from './loginModeReducer';
import user from './userReducer';
import requests from './requestsReducers';
import userRequests from './userRequestsReducer';
import employees from './employeesReducer';
// import userInfo from './userInfoReducer';
import vacationRequestDates from './vacationRequestDatesReducer';
import sickRequestDates from './sickRequestDatesReducer';

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  adminMode,
  errors, // contains registrationMessage and loginMessage
  loginMode, // will have a value of 'login' or 'registration' to control which screen is shown
  user, // will have an id and username if someone is logged in
  requests,
  userRequests,
  employees,
  // userInfo,
  vacationRequestDates,
  sickRequestDates
});

export default rootReducer;
