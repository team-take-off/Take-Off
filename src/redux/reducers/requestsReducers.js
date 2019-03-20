const DEFAULT_ARRAY = [];

const requests = (state = DEFAULT_ARRAY, action) => {
    switch (action.type) {
        case 'SET_REQUESTS':
            return action.payload;
        case 'LOGOUT':
            return DEFAULT_ARRAY;
        default:
            return state;
    }
}

export default requests;