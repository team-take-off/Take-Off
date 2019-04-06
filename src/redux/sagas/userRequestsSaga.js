import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchUserRequests(action) {
    try {
        const serverResponse = yield axios.get(`api/request/current-user`);
        const nextAction = {
            type: 'SET_USER_REQUESTS',
            payload: serverResponse.data
        }
        yield put(nextAction);
    } catch (error) {
        console.log('Error in axios GET:', error);
    }
}

function* addUserRequest(action) {
      try {
          yield axios.post('api/employee/request/', action.payload);
          yield put({type: 'FETCH_USER_INFO'}) 
          yield put({ type: 'FETCH_USER_REQUESTS' });   
      } catch (error) {
          console.log('Error in POST:', error);
      }
  }

function* withdrawUserRequest(action) {
      try {
          const batchID = action.payload;
          yield axios.delete(`api/employee/request/${batchID}`);
          yield put({ type: 'FETCH_USER_REQUESTS' });
          yield put({ type: 'FETCH_REQUESTS' });
      } catch (error) {
          console.log('Error in DELETE:', error);
      }
  }

function* userRequestsSaga() {
    yield takeLatest('FETCH_USER_REQUESTS', fetchUserRequests);
    yield takeLatest('ADD_USER_REQUEST', addUserRequest);
    yield takeLatest('WITHDRAW_USER_REQUEST', withdrawUserRequest);
}

export default userRequestsSaga;
