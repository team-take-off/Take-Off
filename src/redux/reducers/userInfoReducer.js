const userInfo = (state = [], action) => {
    switch (action.type) {
        case 'SET_USER_REQUESTS':
            return action.payload;
        default:
            return state;
    }
};

export default userInfo;