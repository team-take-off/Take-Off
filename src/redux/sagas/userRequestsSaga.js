import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchUserRequests(action) {
    try {
        const serverResponse = yield axios.get(`api/request/current-user`, action.payload);
        yield put({ type: 'SET_USER_REQUESTS', payload: serverResponse.data });
    } catch (error) {
        console.log('Error in saga fetchUserRequests,', error);
        alert('Unable to get users\'s time-off requests');
    }
}

function* addUserRequest(action) {
    try {
        yield axios.post('api/request/', action.payload);
        yield put({ type: 'FETCH_USER_INFO' }); 
        yield put({ type: 'FETCH_USER_REQUESTS' });
        yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in saga addUserRequest(),', error);
        alert('Unable to add new request for time-off');
    }
  }

function* withdrawUserRequest(action) {
    try {
        const batchID = action.payload;
        yield axios.delete(`api/request/${batchID}`);
        yield put({ type: 'FETCH_USER_INFO' });
        yield put({ type: 'FETCH_USER_REQUESTS' });
        yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in saga withdrawUserRequest(),', error);
        alert('Unable to witdraw time-off request');
    }
  }

function* userRequestsSaga() {
    yield takeLatest('FETCH_USER_REQUESTS', fetchUserRequests);
    yield takeLatest('ADD_USER_REQUEST', addUserRequest);
    yield takeLatest('WITHDRAW_USER_REQUEST', withdrawUserRequest);
}

export default userRequestsSaga;
