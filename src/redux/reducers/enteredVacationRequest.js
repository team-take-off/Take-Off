// import moment from 'moment';
// import 'moment-business-days';

// let defaultState = {
//     startDate: moment().nextBusinessDay().format('YYYY-MM-DD'),
//     startHours: 8,
//     endDate: moment().nextBusinessDay().format('YYYY-MM-DD'),
//     endHours: 8,
// };

let defaultState = {
    startDate: '',
    startDayType: 'fullday',
    endDate: '',
    endDayType: 'fullday',
};

const vacationRequestDates = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_VACATION_START_DATE':
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
        case 'SET_VACATION_START_DAY_TYPE':
            return {
                ...state,
                startDayType: action.payload
            };
        case 'SET_VACATION_END_DATE':
            return {
                ...state,
                endDate: action.payload
            };
        case 'SET_VACATION_END_DAY_TYPE':
            return {
                ...state,
                endDayType: action.payload
            };
        case 'RESET_REQUEST':
            return defaultState;
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
};

export default vacationRequestDates;