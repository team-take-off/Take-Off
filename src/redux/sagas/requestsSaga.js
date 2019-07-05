import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchRequests(action) {
    try {
        const serverResponse = yield axios.get('api/request', { params: action.payload });
        yield put({ type: 'SET_REQUESTS', payload: serverResponse.data });
    } catch (error) {
        console.log('Error in axios GET:', error);
    }
}

function* approveRequest(action) {
    try {
        const batchID = action.payload;
        yield axios.put(`api/request/${batchID}`, { requestStatus: 2 });
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_USER_REQUESTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in POST:', error);
    }
}

function* denyRequest(action) {
    try {
        const batchID = action.payload;
        yield axios.put(`api/request/${batchID}`, { requestStatus: 3 });
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_USER_REQUESTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in DELETE:', error);
    }
}

function* withdrawRequest(action) {
    try {
        const batchID = action.payload;
        yield axios.delete(`api/request/${batchID}`);
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_USER_REQUESTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in DELETE:', error);
    }
}

function* requestsSaga() {
    yield takeLatest('FETCH_REQUESTS', fetchRequests);
    yield takeLatest('APPROVE_REQUEST', approveRequest);
    yield takeLatest('DENY_REQUEST', denyRequest);
    yield takeLatest('WITHDRAW_REQUEST', withdrawRequest);
}

export default requestsSaga;
