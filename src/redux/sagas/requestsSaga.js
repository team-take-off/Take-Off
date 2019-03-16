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

function* acceptRequest(action) {
    try {
      const batchID = action.payload;
      yield axios.put(`api/admin/request/${batchID}`, { approved: true });
  
      yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in POST:', error);
    }
  }

  function* denyRequest(action) {
    try {
      const batchID = action.payload;
      yield axios.delete(`api/admin/request/${batchID}`);
  
      yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in DELETE:', error);
    }
  }

function* requestsSaga() {
  yield takeLatest('FETCH_REQUESTS', fetchRequests);
  yield takeLatest('ACCEPT_REQUEST', acceptRequest);
  yield takeLatest('DENY_REQUEST', denyRequest);
}

export default requestsSaga;
