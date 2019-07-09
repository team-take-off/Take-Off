import moment from 'moment';
import 'moment-business-days';

let defaultState = {
    startDate: moment().nextBusinessDay().format('YYYY-MM-DD'),
    startHours: 8,
    endDate: moment().nextBusinessDay().format('YYYY-MM-DD'),
    endHours: 8,
};

const vacationRequestDates = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_VACATION_START_DATE':
            let startRequest = action.payload;
                state.startDate = startRequest
                let endVal
            if(state.startDate>=state.endDate){
                endVal = startRequest
            }else{
                endVal = state.endDate
            }
            return {...state,
                startDate: startRequest,
                endDate: endVal};
        case 'SET_VACATION_START_HOURS':
            startRequest = action.payload;
            state.startHours = startRequest
            return {...state,
                    startHours: startRequest};
        case 'SET_VACATION_END_DATE':
            let endRequest = action.payload;
                state.endDate = endRequest
            return {...state,
                endDate: endRequest};
        case 'SET_VACATION_END_HOURS':
            endRequest = action.payload;
            state.endHours = endRequest
            return {...state,
                endHours: endRequest};
        case 'RESET_REQUEST':
            return defaultState;
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
};

export default vacationRequestDates;