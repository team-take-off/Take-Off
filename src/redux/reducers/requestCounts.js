const DEFAULT_STATE = {
    pending: null,
    approved: null,
    denied: null
};

const requestCounts = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'SET_COUNTS':
            return action.payload;
        case 'LOGOUT':
            return DEFAULT_STATE;
        default:
            return state;
    }
}

export default requestCounts;