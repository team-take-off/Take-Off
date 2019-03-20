const DEFAULT_STATE = [];

const userInfo = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'SET_USER_INFO':
            return action.payload;
        case 'LOGOUT':
            return DEFAULT_STATE;
        default:
            return state;
    }
};

export default userInfo;