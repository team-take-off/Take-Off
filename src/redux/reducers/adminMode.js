const adminMode = (state = true, action) => {
    switch (action.type) {
        case 'ADMIN_MODE_TOGGLE':
            return !state;  
        default:
            return state;
    }
};

export default adminMode;