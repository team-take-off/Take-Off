import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import Request from '../../classes/Request';

function* fetchRequests(action) {
    try {
        const serverResponse = yield axios.get('api/request', { params: action.payload });
        const requests = yield {
            pending: Request.loadArray(serverResponse.data.pending),
            approved: Request.loadArray(serverResponse.data.approved),
            denied: Request.loadArray(serverResponse.data.denied),
            past: Request.loadArray(serverResponse.data.past),
            years: serverResponse.data.years
        };
        yield put({ type: 'SET_REQUESTS', payload: requests });
    } catch (error) {
        console.log('Error in axios GET:', error);
    }
}

function* approveRequest(action) {
    try {
        const id = action.payload;
        yield axios.put(`api/request/${id}`, { requestStatus: 2 });
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_USER_REQUESTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in POST:', error);
    }
}

function* denyRequest(action) {
    try {
        const id = action.payload;
        yield axios.put(`api/request/${id}`, { requestStatus: 3 });
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_USER_REQUESTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in DELETE:', error);
    }
}

function* withdrawRequest(action) {
    try {
        const requestID = action.payload;
        yield axios.delete(`api/request/${requestID}`);
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_USER_REQUESTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in DELETE:', error);
    }
}

function* editRequest(action) {
    try {
        console.log(action.payload);
        yield axios.put('/api/admin/request/edit', {
            id: action.payload.bundleId,
            newDates: action.payload.dates,
        });
        yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in EDIT:', error);
    }
}

function* requestsSaga() {
    yield takeLatest('FETCH_REQUESTS', fetchRequests);
    yield takeLatest('APPROVE_REQUEST', approveRequest);
    yield takeLatest('DENY_REQUEST', denyRequest);
    yield takeLatest('WITHDRAW_REQUEST', withdrawRequest);
    yield takeLatest('EDIT_REQUESTS', editRequest);
}

export default requestsSaga;