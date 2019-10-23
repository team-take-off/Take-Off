import { combineReducers } from 'redux';
import adminMode from './adminMode';
import dryrunUnits from './dryrunUnits';
import employees from './employees';
import enteredSickRequest from './enteredSickRequest';
import enteredVacationRequest from './enteredVacationRequest';
import errors from './errors';
import loginMode from './loginMode';
import requestCounts from './requestCounts';
import requestFilters from './requestFilters';
import requests from './requests';
import requests_refactor from './requests_refactor';
import user from './user';
import userRequests from './userRequests';

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  adminMode,
  dryrunUnits,
  employees,
  enteredSickRequest,
  enteredVacationRequest,
  errors,
  loginMode,
  requestCounts,
  requestFilters,
  requests,
  requests_refactor,
  user,
  userRequests,
});

export default rootReducer;
