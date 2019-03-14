import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchEmployees() {
    try {
        const serverResponse = yield axios.get(`api/admin/employees`);
        yield put({type: 'SET_EMPLOYEES', payload: serverResponse.data});
    } catch (error) {
        console.log('Error in SET_EMPLOYEES:', error);
    }
}

function* deleteEmployee(action) {
    try {
        yield axios.delete(`/api/`)
    } catch (error) {
        console.log('Error in DELETE_EMPLOYEE:', error);
    }
}

function* addEmployee(action) {
    try {
        yield axios.post('api/admin/employees', action.payload);
        yield put({ type: 'FETCH_EMPLOYEES' });
    } catch (error) {
        console.log('Error in ADD_EMPLOYEE:', error);
    }
}

function* deactivateEmployee(action) {
    try {

    } catch (error) {
        console.log('Error in DEACTIVATE_EMPLOYEE:', error);
    }
}

function* activateEmployee(action) {
    try {

    } catch (error) {
        console.log('Error in ACTIVATE_EMPLOYEE:', error);
    }
}
function* employeesSaga() {
  yield takeLatest('FETCH_EMPLOYEES', fetchEmployees);
  yield takeLatest('DELETE_EMPLOYEE', deleteEmployee);
  yield takeLatest('ADD_EMPLOYEE', addEmployee);
  yield takeLatest('DEACTIVATE_EMPLOYEE', deactivateEmployee);
  yield takeLatest('ACTIVATE_EMPLOYEE', activateEmployee);
}

export default employeesSaga;
