import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchRequests() {
  try {
    const serverResponse = yield axios.get('api/admin/request');

    yield put({ type: 'SET_REQUESTS', payload: serverResponse.data });
  } catch (error) {
      console.log('Error in axios GET:', error);
  }
}

function* acceptRequests(action) {
    try {
      yield axios.post('api/admin/request', action.payload);
  
      yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in POST:', error);
    }
  }

  function* denyRequests(action) {
    try {
      yield axios.delete(`api/admin/request/${action.payload}`);
  
      yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in DELETE:', error);
    }
  }

function* requestsSaga() {
  yield takeLatest('FETCH_REQUESTS', fetchRequests);
  yield takeLatest('ACCEPT_REQUEST', acceptRequests);
  yield takeLatest('DENY_REQUEST', denyRequests);
}

export default requestsSaga;
