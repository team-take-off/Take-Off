const DEFAULT_ARRAY = [];

const employees = (state = DEFAULT_ARRAY, action) => {
    switch (action.type) {
        case 'SET_EMPLOYEES':
            return action.payload;
        case 'LOGOUT':
            return DEFAULT_ARRAY;
        default:
            return state;
    }
};

export default employees;