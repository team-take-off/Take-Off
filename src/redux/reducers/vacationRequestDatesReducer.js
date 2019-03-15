const defaultRequest = { date: '', hours: 8 };

const vacationRequestDates = (state = [defaultRequest], action) => {
    switch (action.type) {
        case 'APPEND_VACATION_REQUEST':
            return [...state, defaultRequest];
        case 'SET_VACATION_REQUEST':
            let index = action.payload.index;
            const newRequest = action.payload.request;
            state.splice(index, 1, newRequest);
            return [...state];
        case 'REMOVE_VACATION_REQUEST':
            if (state.length === 1) {
                return [defaultRequest];
            } else {
                let index2 = action.payload.index;
                state.splice(index2, 1);
                return [...state];
            }
        case 'RESET_VACATION_REQUEST':
            return state =[defaultRequest];
        default:
            return state;
    }
};

export default vacationRequestDates;