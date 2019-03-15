import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchUserRequests(action) {
    try {
        const serverResponse = yield axios.get(`api/employee/request`);
        const nextAction = {
            type: 'SET_USER_REQUESTS',
            payload: serverResponse.data
        }
        yield put(nextAction);
    } catch (error) {
        console.log('Error in axios GET:', error);
    }
}

function* addUserRequests(action) {
      try {
          yield axios.post('api/employee/request/', action.payload);
          yield put({ type: 'FETCH_USER_REQUESTS' });
      } catch (error) {
          console.log('Error in POST:', error);
      }
  }

  function* deleteUserRequests(action) {
      try {
          // TODO: Send a request to the server to delete an employee
          yield put({ type: 'FETCH_USER_REQUESTS' });
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
