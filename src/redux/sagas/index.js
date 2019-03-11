import { all } from 'redux-saga/effects';
import loginSaga from './loginSaga';
import registrationSaga from './registrationSaga';
import userSaga from './userSaga';
import requestsSaga from './requestsSaga';
import userRequestsSaga from './userRequestsSaga';
import userInfoSaga from './userInfoSaga';
import employeesSaga from './employeesSaga';
import addTimeSaga from './addTimeSaga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(),
    registrationSaga(),
    userSaga(),
    requestsSaga(),
    userRequestsSaga(),
    userInfoSaga(),
    employeesSaga(),
    addTimeSaga(),
  ]);
}
