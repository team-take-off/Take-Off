import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
function* addLeave(action) {
    console.log(action.payload);
    const additionalLeave = action.payload.leaveType
    try {
        switch (true) {
            case (additionalLeave === 'vacation'):
            try {
                yield axios.post(`/api/admin/addtime/${action.payload.id}`, {leaveType: additionalLeave});
                yield axios.put(`/api/admin/addtime/vacation/${action.payload.id}`);
                yield put({type: 'FETCH_EMPLOYEES'});
            } catch (error) {
                console.log('error in adding vacation time,', error);
            }
            break;
            case (additionalLeave === 'sick'):
            try {
                yield axios.post(`/api/admin/addtime/${action.payload.id}`, {leaveType: additionalLeave});
                yield axios.put(`/api/admin/addtime/sick/${action.payload.id}`);
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

function* addTimeSaga() {
  yield takeLatest('ADD_SICK_DAY', addLeave);
  yield takeLatest('ADD_VACATION_DAY', addLeave);
}

export default addTimeSaga;
