import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import RequestStatus from '../../classes/RequestStatus';

const DEFAULT_FILTERS = {
    employee: null,
    year: null,
    status: null
};

let filters = DEFAULT_FILTERS;

function* fetchCounts(action) {
    try {
        const pending = yield axios.get(`/api/request/count`, { params: { ...filters, status: RequestStatus.APPROVED } });
        const approved = yield axios.get(`/api/request/count`, { params: { ...filters, status: RequestStatus.PENDING } });
        const denied = yield axios.get(`/api/request/count`, { params: { ...filters, status: RequestStatus.DENIED } });

        const counts = {
            pending: pending.data.count,
            approved: approved.data.count,
            denied: denied.data.count
        };
        yield put({ type: 'SET_COUNTS', payload: counts });
    } catch (error) {
        console.log('Error in requestCounts saga fetchCounts(): ', error);
        alert('Unable to fetch time off request counts');
    }
}

function* setFilters(action) {
    try {
        filters = action.payload;
        yield put({ type: 'FETCH_COUNTS' });
    } catch (error) {
        console.log('Error in requestCounts saga setFilters(): ', error);
        alert('Unable to set filtering parameters');
    }
}

function* setEmployeeFilter(action) {
    try {
        filters = { ...filters, employee: action.payload };
        yield put({ type: 'FETCH_COUNTS' });
    } catch (error) {
        console.log('Error in requestCounts saga setEmployeeFilter(): ', error);
        alert('Unable to set filtering parameters');
    }
}

function* setYearFilter(action) {
    try {
        filters = { ...filters, year: action.payload };
        yield put({ type: 'FETCH_COUNTS' });
    } catch (error) {
        console.log('Error in requestCounts saga setYearFilter(): ', error);
        alert('Unable to set filtering parameters');
    }
}

function* requestsSaga() {
    yield takeLatest('FETCH_COUNTS', fetchCounts);
    yield takeLatest('SET_FILTERS', setFilters);
    yield takeLatest('SET_EMPLOYEE_FILTER', setEmployeeFilter);
    yield takeLatest('SET_YEAR_FILTER', setYearFilter);
}

export default requestsSaga;
