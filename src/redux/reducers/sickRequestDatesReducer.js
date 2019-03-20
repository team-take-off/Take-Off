import moment from 'moment';
import 'moment-business-days';

const DEFAULT_REQUEST = {
    startDate: moment().nextBusinessDay().format('YYYY-MM-DD'),
    startHours: 8,
    endDate: moment().nextBusinessDay().format('YYYY-MM-DD'),
    endHours: 8,
};

const sickRequestDates = (state = DEFAULT_REQUEST, action) => {
    switch (action.type) {
        case 'SET_SICK_START_DATE':
            const startDate = action.payload;
            let endDate = state.endDate;
            if (startDate >= endDate) {
                endDate = startDate;
            }
            return {
                ...state,
                startDate: startDate,
                endDate: endDate
            };
        case 'SET_SICK_START_HOURS':
            return {
                ...state,
                startHours: action.payload
            };
        case 'SET_SICK_END_DATE':
            return {
                ...state,
                endDate: action.payload
            };
        case 'SET_SICK_END_HOURS':
            return {
                ...state,
                endHours: action.payload
            };
        case 'RESET_REQUEST':
            return DEFAULT_REQUEST;
        case 'LOGOUT':
            return DEFAULT_REQUEST;
        default:
            return state;
    }
};

export default sickRequestDates;