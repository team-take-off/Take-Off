import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
function* addLeave(action) {
    const additionalLeave = action.payload.leaveType
    const POST = axios.post(`/api/admin/addtime/${action.payload.id}`, {leaveType: additionalLeave});
    const PUT = axios.put(`/api/admin/addtime/${action.payload.id}`, {leaveType: additionalLeave});
    
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

function* addTimeSaga() {
  yield takeLatest('ADD_LEAVE_DAY', addLeave);
}

export default addTimeSaga;
