import { combineReducers } from 'redux';

const requests = (state = [], action) => {
    switch (action.type) {
        case 'SET_REQUESTS':
            return action.payload;
        default:
            return state;
    }
};

const batchOfRequests = (state = [], action) => {
    switch (action.type) {
        case 'SET_BATCH_REQUESTS':
            return action.payload;
        default:
            return state;
    }
};

const allRequests = combineReducers ({
    requests,
    batchOfRequests
})

export default allRequests;