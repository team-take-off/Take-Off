import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* addSickDay(action) {
    try {
        yield axios.post(`/api/admin/addtime/sick/${action.payload}`);
        yield axios.put(`/api/admin/addtime/sick/${action.payload}`);
        yield put({type: 'FETCH_EMPLOYEES'});
    } catch (error) {
        console.log('Error in axios sick POST:', error);
    }
}

function* addVacationDay(action) {
    try {
        yield axios.post(`/api/admin/addtime/vacation/${action.payload}`);
        yield axios.put(`/api/admin/addtime/vacation/${action.payload}`);
        yield put({type: 'FETCH_EMPLOYEES'});
    } catch (error) {
        console.log('Error in axios vacation POST:', error);
    }
}

function* addTimeSaga() {
  yield takeLatest('ADD_SICK_DAY', addSickDay);
  yield takeLatest('ADD_VACATION_DAY', addVacationDay);
}

export default addTimeSaga;
