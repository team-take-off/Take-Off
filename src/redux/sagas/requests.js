import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import Request from '../../classes/Request';
import RequestStatus from '../../classes/RequestStatus';

const DEFAULT_FILTERS = {
    employee: null,
    year: null,
    status: null
};

let filters = DEFAULT_FILTERS;

function* fetchRequests(action) {
    try {
        const response = yield axios.get('api/request/', { params: filters });
        const requests = yield Request.loadArray(response.data);
        yield put({ type: 'SET_REQUESTS', payload: requests });
    } catch (error) {
        console.log('Error in requests saga fetchRequests(): ', error);
        alert('Unable to fetch list of time off requests');
    }
}

function* addRequest(action) {
    try {
        yield axios.post('api/request/', action.payload);
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_COUNTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in requests saga addUserRequest(): ', error);
        alert('Unable to add new request for time off');
    }
}

function* approveRequest(action) {
    try {
        const id = action.payload;
        yield axios.put(`api/request/${id}`, { requestStatus: RequestStatus.APPROVED });
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_COUNTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in requests saga approveRequest(): ', error);
        alert('Unable to approve request for time off');
    }
}

function* denyRequest(action) {
    try {
        const id = action.payload;
        yield axios.put(`api/request/${id}`, { requestStatus: RequestStatus.DENIED });
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_COUNTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in requests saga denyRequest(): ', error);
        alert('Unable to deny request for time off');
    }
}

function* withdrawRequest(action) {
    try {
        const requestID = action.payload;
        yield axios.delete(`api/request/${requestID}`);
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_COUNTS' });
        yield put({ type: 'FETCH_USER_INFO' });
    } catch (error) {
        console.log('Error in requests saga withdrawRequest(): ', error);
        alert('Unable to withdraw request for time off');
    }
}

function* deleteRequest(action) {
    try {
        const requestID = action.payload.id;

        yield axios.delete(`api/request/${requestID}`, {
            params: {
                specialEdit: true
            }
        });
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_COUNTS' });
    } catch (error) {
        console.log('Error in requests saga deleteRequest(): ', error);
        alert('Unable to delete request for time off');
    }
}

function* editRequest(action) {
    try {
        console.log(action.payload);
        yield axios.put('/api/admin/request/edit', {
            id: action.payload.bundleId,
            newDates: action.payload.dates,
        });
        yield put({ type: 'FETCH_REQUESTS' });
        yield put({ type: 'FETCH_COUNTS' });
    } catch (error) {
        console.log('Error in requests saga editRequest(): ', error);
        alert('Unable to edit request for time off');
    }
}

function* setFilters(action) {
    try {
        filters = action.payload;
        console.log(filters);
        yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in requests saga setFilters(): ', error);
        alert('Unable to set filtering parameters');
    }
}

function* setEmployeeFilter(action) {
    try {
        filters = { ...filters, employee: action.payload };
        yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in requests saga setEmployeeFilter(): ', error);
        alert('Unable to set filtering parameters');
    }
}

function* setYearFilter(action) {
    try {
        filters = { ...filters, year: action.payload };
        yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in requests saga setYearFilter(): ', error);
        alert('Unable to set filtering parameters');
    }
}

function* setStatusFilter(action) {
    try {
        filters = { ...filters, status: action.payload };
        yield put({ type: 'FETCH_REQUESTS' });
    } catch (error) {
        console.log('Error in requests saga setStatusFilter(): ', error);
        alert('Unable to set filtering parameters');
    }
}

function* requestsSaga() {
    yield takeLatest('FETCH_REQUESTS', fetchRequests);
    yield takeLatest('ADD_REQUEST', addRequest);
    yield takeLatest('APPROVE_REQUEST', approveRequest);
    yield takeLatest('DENY_REQUEST', denyRequest);
    yield takeLatest('WITHDRAW_REQUEST', withdrawRequest);
    yield takeLatest('DELETE_REQUEST', deleteRequest);
    yield takeLatest('EDIT_REQUESTS', editRequest);
    yield takeLatest('SET_FILTERS', setFilters);
    yield takeLatest('SET_EMPLOYEE_FILTER', setEmployeeFilter);
    yield takeLatest('SET_YEAR_FILTER', setYearFilter);
    yield takeLatest('SET_STATUS_FILTER', setStatusFilter);
}

export default requestsSaga;
