const moment = require('moment-business-days');
moment().format();
let defaultRequest = { date: moment().nextBusinessDay().format('YYYY-MM-DD'), hours: 8 };

const sickRequestDates = (state = [defaultRequest], action) => {
    switch (action.type) {
        case 'APPEND_SICK_REQUEST':
            const nextDate = { date: moment(state[state.length - 1].date).nextBusinessDay().format('YYYY-MM-DD'), hours: 8 }
            return [...state, nextDate];
        case 'SET_SICK_REQUEST':
            let index = action.payload.index;
            const newRequest = action.payload.request;
            state.splice(index, 1, newRequest);
            return [...state];
        case 'REMOVE_SICK_REQUEST':
            if (state.length === 1) {
                return [defaultRequest];
            } else {
                let index2 = action.payload.index;
                state.splice(index2, 1);
                return [...state];
            }
        case 'RESET_SICK_REQUEST':
            return state = [defaultRequest];
        default:
            return state;
    }
};

export default sickRequestDates;