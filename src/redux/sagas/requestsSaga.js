import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchRequests() {
  try {
    const serverResponse = yield axios.get('api/admin/request');

    yield put({ type: 'SET_REQUESTS', payload: serverResponse.data });
  } catch (error) {
      console.log('Error:', error);
  }
}

function* acceptRequests(action) {
    try {
      yield axios.post('api/admin/request', action.payload);
  
      yield put({ type: 'SET_REQUESTS' });
    } catch (error) {
        console.log('Error:', error);
    }
  }

function* requestsSaga() {
  yield takeLatest('FETCH_REQUESTS', fetchRequests);
  yield takeLatest('ACCEPT_REQUESTS', acceptRequests);
}

export default requestsSaga;
