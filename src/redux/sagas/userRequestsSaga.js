import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchUserRequests(action) {
  try {
    const serverResponse = yield axios.get(`api/admin/request/${action.payload}`);
  } catch (error) {
      console.log('Error in axios GET:', error);
  }
}

function* addUserRequests(action) {
    try {
    } catch (error) {
        console.log('Error in POST:', error);
    }
  }

  function* deleteUserRequests(action) {
    try {
    } catch (error) {
        console.log('Error in DELETE:', error);
    }
  }

function* userRequestsSaga() {
  yield takeLatest('FETCH_USER_REQUESTS', fetchUserRequests);
  yield takeLatest('ADD_USER_REQUEST', addUserRequests);
  yield takeLatest('DELETE_USER_REQUEST', deleteUserRequests);
}

export default userRequestsSaga;
