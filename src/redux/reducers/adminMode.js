const DEFAULT_STATE = true;

const adminMode = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'ADMIN_MODE_TOGGLE':
            return !state;
        case 'LOGOUT':
            return DEFAULT_STATE;
        default:
            return state;
    }
};

export default adminMode;