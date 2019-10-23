import { all } from 'redux-saga/effects';
import employees from './employees';
import login from './login';
import requestCounts from './requestCounts';
import requests from './requests';
import requests_refactor from './requests_refactor';
import userRequests from './userRequests';
import user from './user';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    employees(),
    login(),
    requestCounts(),
    requests(),
    requests_refactor(),
    userRequests(),
    user(),
  ]);
}
