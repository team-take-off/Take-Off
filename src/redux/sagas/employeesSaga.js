import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchEmployees() {
    try {
        const serverResponse = yield axios.get(`api/admin/employees`);
        yield put({type: 'SET_EMPLOYEES', payload: serverResponse.data})
    } catch (error) {
        console.log('Error in axios GET:', error);
    }
}

function* deleteEmployee(action) {
    try {

    } catch (error) {
        console.log('Error in DELETE:', error);
    }
}


function* addEmployee(action) {
    try {

    } catch (error) {
        console.log('Error in DELETE:', error);
    }
}

function* deactivateEmployee(action) {
    try {

    } catch (error) {
        console.log('Error in :', error);
    }
}

function* activateEmployee(action) {
    try {

    } catch (error) {
        console.log('Error in :', error);
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
