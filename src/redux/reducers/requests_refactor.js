const DEFAULT_STATE = [];

const requests = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'SET_REQUESTS_refactor':
            return action.payload;
        case 'LOGOUT':
            return DEFAULT_STATE;
        default:
            return state;
    }
}

export default requests;