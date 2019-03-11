import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchUserInfo(action) {
  try {
    const serverResponse = yield axios.get(`api/employee/userinfo/${action.payload}`);
    yield put({type: 'SET_USER_INFO', payload: serverResponse.data});
  } catch (error) {
      console.log('Error in axios GET:', error);
  }
}

function* userInfoSaga() {
  yield takeLatest('FETCH_USER_INFO', fetchUserInfo);
}

export default userInfoSaga;
