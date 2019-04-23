import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* addLeave(action) {
    const additionalLeave = action.payload.leaveType;
    const POST = axios.post(`/api/accrued-time/${action.payload.id}`, action.payload);
    const PUT = axios.put(`/api/accrued-time/${action.payload.id}`, action.payload);
    
    try {
        switch (true) {
            case (additionalLeave === 'vacation'):
                try {
                    yield POST
                    yield PUT
                    yield put({type: 'FETCH_EMPLOYEES'});
                } catch (error) {
                    console.log('error in adding vacation time,', error);
                }
                break;
            case (additionalLeave === 'sick'):
                try {
                    yield POST
                    yield PUT
                    yield put({type: 'FETCH_EMPLOYEES'});
                } catch (error) {
                    console.log('error in adding sick time,', error);
                }
                break;
            default:
                break;
        }
    } catch (error) {
        console.log('Error in leave request', error);
    }
}

function* subLeave(action) {
    try {
        yield axios.post(`/api/accrued-time/${action.payload.id}`, action.payload);
        yield axios.put(`/api/accrued-time/${action.payload.id}`, action.payload);
        yield put({ type: 'FETCH_EMPLOYEES' });
    } catch (error) {
        console.log('error in subLeave saga,', error);
    }
}

function* addTimeSaga() {
    yield takeLatest('ADD_LEAVE_DAY', addLeave);
    yield takeLatest('SUB_LEAVE_DAY', subLeave);
}

export default addTimeSaga;
