const DEFAULT_ARRAY = [];

const userRequests = (state = DEFAULT_ARRAY, action) => {
    switch (action.type) {
        case 'SET_USER_REQUESTS':
            return action.payload.requests;
        case 'LOGOUT':
            return DEFAULT_ARRAY;
        default:
            return state;
    }
};

export default userRequests;