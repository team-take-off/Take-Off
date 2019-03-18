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
        yield axios.delete(`api/admin/employees/${action.payload}`);
        const nextAction = { type: 'FETCH_EMPLOYEES' };
        yield put(nextAction);
    } catch (error) {
        console.log('Error in DELETE_EMPLOYEE:', error);
        alert('Something went wrong')
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

function* updateEmployee(action) {
    try {
        yield axios.put('api/admin/employees/', action.payload);
        yield put({ type: 'FETCH_EMPLOYEES' });
    } catch (error) {
        console.log('Error in UPDATE_EMPLOYEE:', error);
        alert('Something Went Wrong')
    }
}

function* deactivateEmployee(action) {
    try {
        const deactivate = { is_active: false };
        yield axios.put(`api/admin/employees/active/${action.payload}`, deactivate);
        yield put({ type: 'FETCH_EMPLOYEES' });
    } catch (error) {
        console.log('Error in DEACTIVATE_EMPLOYEE:', error);
        alert('Something Went Wrong')
    }
}

function* activateEmployee(action) {
    try {
        const activate = { is_active: true };
        yield axios.put(`api/admin/employees/active/${action.payload}`, activate);
        yield put({ type: 'FETCH_EMPLOYEES' });
    } catch (error) {
        console.log('Error in ACTIVATE_EMPLOYEE:', error);
    }
}
function* employeesSaga() {
  yield takeLatest('FETCH_EMPLOYEES', fetchEmployees);
  yield takeLatest('DELETE_EMPLOYEE', deleteEmployee);
  yield takeLatest('ADD_EMPLOYEE', addEmployee);
  yield takeLatest('UPDATE_EMPLOYEE', updateEmployee);
  yield takeLatest('DEACTIVATE_EMPLOYEE', deactivateEmployee);
  yield takeLatest('ACTIVATE_EMPLOYEE', activateEmployee);
}

export default employeesSaga;
