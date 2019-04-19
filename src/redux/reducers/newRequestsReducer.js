const DEFAULT_STATE = {
    years: [],
    pending: [],
    approved: [],
    denied: [],
    past: []
};

const newRequests = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'SET_REQUESTS':
            return action.payload;
        case 'LOGOUT':
            return DEFAULT_STATE;
        default:
            return state;
    }
}

export default newRequests;