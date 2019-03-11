import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* addSickDay(action) {
    try {
    } catch (error) {
        console.log('Error in axios sick POST:', error);
    }
}

function* addVacationDay(action) {
    try {
    } catch (error) {
        console.log('Error in axios vacation POST:', error);
    }
}

function* addTimeSaga() {
  yield takeLatest('FETCH_SICK_DAY', addSickDay);
  yield takeLatest('ADD_VACATION_DAY', addVacationDay);
}

export default addTimeSaga;
