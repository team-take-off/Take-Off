const DEFAULT = [];

const dryrunUnits = (state = DEFAULT, action) => {
    switch (action.type) {
        case 'SET_DRYRUN_UNITS':
            return action.payload;
        case 'RESET_DRYRUN_UNITS':
            return DEFAULT;
        case 'LOGOUT':
            return DEFAULT;
        default:
            return state;
    }
};

export default dryrunUnits;