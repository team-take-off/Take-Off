import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* addLeave(action) {
    const additionalLeave = action.payload.leaveType;
    try {
        yield axios.put(`/api/accrued-time/${action.payload.id}`, action.payload);
        yield put({type: 'FETCH_EMPLOYEES'});
    } catch (error) {
        if (additionalLeave === 'vacation') {
            console.log('Error in adding vacation time,', error);
        } else if (additionalLeave === 'sick') {
            console.log('Error in adding sick time,', error);
        } else {
            console.log('Error attempted to add unknown time off type,', error);
        }
    }
}

function* subLeave(action) {
    try {
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
