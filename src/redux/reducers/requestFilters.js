const DEFAULT_STATE = {
    employee: null,
    year: null,
    status: null,
    startDate: '2017-01-01'
};

const requestFilters = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'SET_FILTERS':
            return action.payload;
        case 'SET_EMPLOYEE_FILTER':
            return {...state, employee: action.payload};
        case 'SET_YEAR_FILTER':
            return { ...state, year: action.payload };
        case 'SET_STATUS_FILTER':
            return { ...state, status: action.payload };
        case 'LOGOUT':
            return DEFAULT_STATE;
        default:
            return state;
    }
}

export default requestFilters;