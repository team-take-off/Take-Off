import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import Request from '../../classes/Request';

function* fetchUserRequests(action) {
    try {
        let employee = null;
        let year = null;
        if (action.payload) {
            employee = action.payload.user;
            year = action.payload.year;
        }

        const years = yield axios.get('/api/request/year-available', { params: { employee } });

        const pending = yield axios.get('api/request/', { params: { employee, year, status: 1 } });
        const approved = yield axios.get('api/request/', { params: { employee, year, status: 2 } });
        const denied = yield axios.get('api/request/', { params: { employee, year, status: 3 } });
        const past = yield axios.get('api/request/', { params: { employee, year, past: true } });

        const userRequests = yield {
            pending: Request.loadArray(pending.data),
            approved: Request.loadArray(approved.data),
            denied: Request.loadArray(denied.data),
            past: Request.loadArray(past.data),
            years: years.data
        };
        yield put({ type: 'SET_USER_REQUESTS', payload: userRequests });
    } catch (error) {
        console.log('Error in saga fetchUserRequests,', error);
        alert('Unable to get users\'s time-off requests');
    }
}

function* addUserRequest(action) {
    try {
        const user = action.payload.user;
        yield axios.post('api/request/', action.payload);
        yield put({ type: 'FETCH_USER_INFO' }); 
        yield put({ type: 'FETCH_USER_REQUESTS', payload: { user } });
        yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in saga addUserRequest(),', error);
        alert('Unable to add new request for time-off');
    }
  }

function* withdrawUserRequest(action) {
    try {
        const user = action.payload.user;
        const requestID = action.payload.id;
        yield axios.delete(`api/request/${requestID}`);
        yield put({ type: 'FETCH_USER_INFO' });
        yield put({ type: 'FETCH_USER_REQUESTS', payload: { user } });
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
